# Bug Fix: Routing Error - "Cannot read properties of undefined (reading 'match')"

## Issue Description
When loading the website, users encountered the error:
```
[plugin:runtime-error-plugin] Cannot read properties of undefined (reading 'match')
```

## Root Cause
The error was caused by **VIOLATING REACT'S RULES OF HOOKS** in the `ServiceLandingPage` component.

### The Problem:
The component had conditional early returns **BEFORE** calling hooks:

```typescript
// ❌ WRONG - Violates Rules of Hooks
const ServiceLandingPage = () => {
  const [match, params] = useRoute('/:serviceSlug');
  
  if (!match) return null;  // ❌ Early return BEFORE useQuery!
  
  const serviceSlug = params?.serviceSlug || '';
  if (!serviceSlug) return null;  // ❌ Early return BEFORE useQuery!
  
  const { data: service } = useQuery(...);  // ❌ Called conditionally!
  useEffect(...);  // ❌ Called conditionally!
  // ...
}
```

This violates React's fundamental rule: **Hooks must be called in the same order on every render.**

When the component rendered with different conditions:
1. Sometimes hooks were called (when match = true)
2. Sometimes hooks were NOT called (when match = false, early return happened)
3. React lost track of which hook was which
4. Hook state became undefined, causing the "reading 'match'" error

### Additional Issues:
1. **Catch-all route conflict**: The route `/:serviceSlug` was matching ALL routes including the homepage `/`
2. **Null reference errors**: Missing null safety checks for service data
3. **String method errors**: Calling `.includes()` and `.split()` on potentially undefined values

## The Solution

### Fix 1: Follow Rules of Hooks

## Files Modified

### 1. `/client/src/pages/service-landing-page.tsx`

### Fix 1: Follow Rules of Hooks

```typescript
// ✅ CORRECT - All hooks called unconditionally
const ServiceLandingPage = () => {
  const [match, params] = useRoute('/:serviceSlug');
  const [_, setLocation] = useLocation();
  
  const serviceSlug = params?.serviceSlug || '';
  const knownRoutes = ['admin', 'services', 'portfolio', ...];
  const shouldRender = match && serviceSlug && !knownRoutes.includes(serviceSlug);

  // ✅ Hooks always called, regardless of conditions
  const { data: service, isLoading, error } = useQuery<Service>({
    queryKey: [`/api/services/${serviceSlug}`],
    enabled: shouldRender && !!serviceSlug,  // Control execution with 'enabled'
    retry: 2,
  });

  useEffect(() => {
    if (service) {
      trackEvent('view_service_page', 'service', service.title);
    }
  }, [service]);

  useEffect(() => {
    if (shouldRender && !isLoading && !service && serviceSlug) {
      setLocation('/services');
    }
  }, [shouldRender, isLoading, service, error, setLocation, serviceSlug]);
  
  // ✅ Early returns happen AFTER all hooks
  if (!shouldRender) {
    return null;
  }
  
  // Rest of component...
}
```

**Key Changes:**
- Created `shouldRender` variable to track rendering conditions
- All hooks (useQuery, useEffect) are called unconditionally
- Used `enabled` prop in useQuery to control when query runs
- Early returns happen AFTER all hooks are called
- React can now properly track hook state on every render

### Fix 2: Added null safety checks
```typescript
// Before
if (!service) return null;

const descriptionParts = service.fullDescription.split('\n\n');
const featuresSection = descriptionParts.find((part: string) => part.includes('- '));
const benefitsSection = descriptionParts.find((part: string) => part.includes('Benefits of') || part.toLowerCase().includes('benefits:'));

// After
if (!service || !service.fullDescription) return null;

const descriptionParts = service.fullDescription.split('\n\n');
const introText = descriptionParts[0] || '';

const featuresSection = descriptionParts.find((part: string) => part && part.includes('- '));
const features = featuresSection
  ? featuresSection.split('\n').filter((line: string) => line && line.startsWith('- ')).map((line: string) => line.substring(2))
  : [];

const benefitsSection = descriptionParts.find((part: string) => part && (part.includes('Benefits of') || part.toLowerCase().includes('benefits:')));
const benefits = benefitsSection
  ? benefitsSection.split('\n').filter((line: string) => line && line.startsWith('- ')).map((line: string) => line.substring(2))
  : [];
```

**Purpose**: 
- Checks if `service.fullDescription` exists before calling `.split()`
- Validates that parts exist before calling `.includes()` on them
- Provides fallback empty array if sections aren't found
- Ensures all string operations are performed on valid strings

### Fix 3: Known routes filter
```typescript
// Before
useEffect(() => {
  if (!isLoading && !service && !error) {
    setLocation('/services');
  }
}, [isLoading, service, error, setLocation]);

// After
useEffect(() => {
  if (!isLoading && !service && serviceSlug) {
    setLocation('/services');
  }
}, [isLoading, service, error, setLocation, serviceSlug]);
```

**Purpose**: Only redirects when there's actually a serviceSlug to look for, preventing unnecessary redirects.

## Testing
After the fix:
- ✅ Homepage loads without errors
- ✅ Services page loads correctly
- ✅ Individual service pages work
- ✅ All static routes function properly
- ✅ Catch-all route only activates for valid service slugs
- ✅ No more undefined reference errors

## Prevention
To prevent similar issues in the future:

1. **ALWAYS follow Rules of Hooks**:
   - Hooks must be called at the top level
   - Hooks must be called in the same order every time
   - Never put hooks inside conditions, loops, or nested functions
   - Use the `enabled` prop or conditional logic INSIDE hooks, not before them

2. **Validate data** before using string/array methods
3. **Use optional chaining** (`?.`) when accessing nested properties
4. **Provide fallback values** for potentially undefined data
5. **Test catch-all routes** carefully to avoid conflicts
6. **Enable ESLint rule** `react-hooks/rules-of-hooks` to catch violations

## React Rules of Hooks Refresher

From [React Docs](https://react.dev/reference/rules/rules-of-hooks):

✅ **DO:**
```typescript
function Component() {
  const [state, setState] = useState(0);
  useEffect(() => {...});
  
  if (someCondition) {
    return <div>Early return OK after hooks</div>;
  }
  // More rendering
}
```

❌ **DON'T:**
```typescript
function Component() {
  if (someCondition) {
    return null;  // ❌ Don't return before hooks!
  }
  
  const [state, setState] = useState(0);  // ❌ Hook called conditionally!
}
```

## Verification Steps
1. Visit http://localhost:5000 (homepage should load)
2. Navigate to http://localhost:5000/services (services page should load)
3. Click on any service (service detail should load)
4. Try accessing http://localhost:5000/invalid-slug (should redirect to services)
5. Check browser console for errors (should be clean)

## Date Fixed
January 7, 2025

## Status
✅ RESOLVED - The routing error has been completely fixed by following React's Rules of Hooks and adding proper null safety checks. The application now handles all routes correctly.
