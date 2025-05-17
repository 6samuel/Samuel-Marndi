import React, { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useRoute, useLocation, Link } from 'wouter';
import { Helmet } from 'react-helmet-async';
import { Button } from '@/components/ui/button';
import { Loader2, ArrowRight, Check, Star, Award, Zap, TrendingUp, Clock, BarChart } from 'lucide-react';
import { OptimizedImage } from '@/components/ui/optimized-image';
import QuickQuoteModal from '@/components/forms/quick-quote-modal';
import { motion } from 'framer-motion';
import { trackEvent } from '@/lib/analytics';
import { Service } from '@shared/schema';

// Animation variants
const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

// Sub-service data (this will be replaced with dynamic data from API)
const subServiceData: Record<string, any> = {
  'chatbot-development': {
    parent: 'ai-integration',
    title: 'Chatbot Development',
    description: 'Intelligent conversational AI solutions for customer support, lead generation, and business automation',
    fullDescription: `I develop custom AI-powered chatbots that deliver exceptional user experiences while automating repetitive tasks, providing instant support, and increasing conversion rates.

My chatbot development services include:

## Technology Stack
- Natural Language Processing (NLP) integration using state-of-the-art models
- Machine learning algorithms for continuous improvement
- Omnichannel deployment (website, messaging apps, social media)
- Seamless integration with existing business systems
- Custom conversation flows tailored to your business needs
- Analytics dashboard for performance tracking

## Industries Served
- E-commerce: Product recommendations, order tracking, returns management
- Healthcare: Appointment scheduling, symptom checking, medication reminders
- Finance: Account balance inquiries, transaction analysis, financial advisors
- Real Estate: Property searches, viewing scheduling, qualification assessments
- Hospitality: Reservations, customer service, virtual concierge
- Education: Student support, course information, assignment assistance

## Key Benefits
- 24/7 availability with instant response times
- Significant cost reduction compared to traditional customer service
- Scalable solution that can handle unlimited concurrent conversations
- Data collection for valuable customer insights
- Consistent service quality that improves over time
- Personalized customer interactions based on user history

## Development Process
1. **Discovery**: Understanding your business goals and customer needs
2. **Design**: Creating conversation flows and bot personality
3. **Development**: Building and integrating the chatbot solution
4. **Testing**: Rigorous quality assurance and user acceptance testing
5. **Deployment**: Launching across selected channels
6. **Optimization**: Continuous monitoring and improvement

According to research by Juniper Research, chatbots will save businesses over $8 billion annually by 2025. Implementing an AI chatbot can reduce customer service costs by up to 30% while handling up to 80% of routine customer queries.

Whether you need a simple FAQ bot or a sophisticated AI assistant, I deliver chatbot solutions that enhance customer experiences while maximizing operational efficiency.`,
    features: [
      'Natural Language Processing (NLP) integration',
      'Multi-platform deployment',
      'Custom conversation flows',
      'Analytics dashboard',
      'Business system integration',
      'Continuous learning capabilities'
    ],
    benefits: [
      '24/7 customer support availability',
      'Reduced operational costs',
      'Improved customer satisfaction',
      'Valuable data collection',
      'Increased conversion rates',
      'Scalable customer interactions'
    ],
    imageUrl: 'https://images.unsplash.com/photo-1531746790731-6c087fecd65a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
    techStack: ['DialogFlow', 'Microsoft Bot Framework', 'Rasa', 'Amazon Lex', 'TensorFlow', 'Python', 'Node.js', 'NLP Models', 'Machine Learning'],
    stats: [
      { label: 'Faster Resolution', value: '70%' },
      { label: 'Cost Reduction', value: '30%' },
      { label: 'Satisfaction Rate', value: '85%' }
    ],
    useCases: [
      'Customer service automation',
      'Lead qualification',
      'Product recommendations',
      'Appointment scheduling',
      'Internal employee assistance',
      'Data collection and analysis'
    ]
  },
  'machine-learning-solutions': {
    parent: 'ai-integration',
    title: 'Machine Learning Solutions',
    description: 'Custom ML models to solve complex business problems and deliver actionable insights',
    fullDescription: `I design and implement custom machine learning solutions that transform raw data into valuable business insights, predictions, and automated decision-making capabilities.

My machine learning services cover the entire development lifecycle:

## Core Technologies
- Supervised learning for predictive analytics
- Unsupervised learning for pattern detection
- Deep learning for complex data processing
- Transfer learning for efficient model training
- Reinforcement learning for optimization problems
- Computer vision for image and video analysis
- Natural language processing for text understanding

## Industry Applications
- Retail: Demand forecasting, inventory optimization, recommendation systems
- Finance: Risk assessment, fraud detection, algorithmic trading
- Healthcare: Disease prediction, treatment optimization, medical imaging analysis
- Manufacturing: Predictive maintenance, quality control, process optimization
- Energy: Consumption forecasting, grid optimization, anomaly detection
- Marketing: Customer segmentation, campaign optimization, churn prediction
- Agriculture: Crop yield prediction, disease detection, resource optimization

## Key Advantages
- Data-driven decision making with high accuracy
- Automation of complex analytical tasks
- Uncovering hidden patterns and correlations
- Predictive capabilities for proactive management
- Scalable solutions that improve over time
- Competitive advantage through advanced analytics

## Development Methodology
1. **Problem Definition**: Clearly understanding business objectives
2. **Data Collection & Preparation**: Gathering, cleaning, and preprocessing data
3. **Feature Engineering**: Identifying and creating relevant variables
4. **Model Selection & Training**: Choosing and optimizing algorithms
5. **Evaluation & Refinement**: Validating model performance
6. **Deployment & Monitoring**: Implementing and maintaining the solution

According to McKinsey Global Institute, AI and machine learning could potentially create $3.5 trillion to $5.8 trillion in annual value across nine business functions in 19 industries. Organizations implementing ML solutions have reported productivity increases of 20-30% in their analytics work.

From recommendation engines to predictive maintenance systems, I develop machine learning solutions that deliver measurable ROI while solving your most challenging business problems.`,
    features: [
      'Custom algorithm development',
      'Predictive modeling',
      'Data preprocessing & feature engineering',
      'Model training & validation',
      'Deployment architecture design',
      'Continuous model monitoring'
    ],
    benefits: [
      'Data-driven decision making',
      'Process automation capability',
      'Enhanced prediction accuracy',
      'Identification of hidden patterns',
      'Operational cost reduction',
      'Competitive market advantage'
    ],
    imageUrl: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
    techStack: ['TensorFlow', 'PyTorch', 'Scikit-learn', 'Keras', 'Python', 'R', 'CUDA', 'Pandas', 'NumPy', 'Docker', 'Kubernetes'],
    stats: [
      { label: 'Prediction Accuracy', value: '95%' },
      { label: 'Process Efficiency', value: '40%' },
      { label: 'Data Processing', value: 'TB+' }
    ],
    useCases: [
      'Predictive analytics',
      'Image recognition',
      'Natural language processing',
      'Recommendation systems',
      'Anomaly detection',
      'Optimization problems'
    ]
  },
  'computer-vision-applications': {
    parent: 'ai-integration',
    title: 'Computer Vision Applications',
    description: 'Visual AI solutions for object detection, recognition, and analysis across industries',
    fullDescription: `I develop sophisticated computer vision applications that enable machines to interpret and understand visual information from the world, automating tasks that typically require human visual abilities.

My computer vision services include:

## Core Technologies
- Object detection and recognition
- Image classification and segmentation
- Facial recognition and emotion analysis
- Optical character recognition (OCR)
- Activity and motion tracking
- 3D reconstruction and depth estimation
- Augmented reality integration

## Industry Applications
- Retail: Inventory management, checkout-free shopping, customer behavior analysis
- Manufacturing: Quality control, defect detection, assembly line monitoring
- Security: Surveillance systems, access control, anomaly detection
- Healthcare: Medical imaging analysis, patient monitoring, surgical assistance
- Automotive: Driver assistance systems, autonomous vehicle development
- Agriculture: Crop monitoring, disease detection, yield estimation
- Construction: Safety compliance, progress monitoring, equipment tracking

## Key Benefits
- Automation of visual inspection processes
- Real-time monitoring and decision making
- Increased accuracy over human visual inspection
- Consistent performance without fatigue
- Scalable vision processing capabilities
- Rich data collection for further analysis

## Development Approach
1. **Requirements Analysis**: Understanding the visual processing needs
2. **Data Acquisition**: Collecting and annotating training images/videos
3. **Model Development**: Creating and training vision algorithms
4. **System Integration**: Connecting with cameras and existing software
5. **Testing & Optimization**: Ensuring accuracy in various conditions
6. **Deployment & Maintenance**: Implementation and continuous improvement

According to research by Grand View Research, the global computer vision market size is expected to reach $19.1 billion by 2027, growing at a CAGR of 7.6%. Companies implementing computer vision report efficiency improvements of up to 50% in quality inspection processes.

Whether you need to automate visual inspections, enhance security systems, or develop new visual interfaces, I create computer vision solutions that transform the way your business processes and utilizes visual information.`,
    features: [
      'Real-time object detection',
      'Image classification',
      'Facial recognition capabilities',
      'Optical character recognition',
      'Scene understanding',
      'Motion & activity analysis'
    ],
    benefits: [
      'Automated visual inspection',
      'Enhanced security monitoring',
      'Reduced quality control costs',
      'Improved safety compliance',
      'Real-time data processing',
      'Human-like visual capabilities'
    ],
    imageUrl: 'https://images.unsplash.com/photo-1570215171323-4ec328f3f5fa?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
    techStack: ['OpenCV', 'TensorFlow', 'PyTorch', 'YOLO', 'Detectron2', 'MediaPipe', 'CUDA', 'Python', 'C++', 'Deep Learning'],
    stats: [
      { label: 'Detection Accuracy', value: '98%' },
      { label: 'Processing Speed', value: '60 FPS' },
      { label: 'Error Reduction', value: '85%' }
    ],
    useCases: [
      'Quality control automation',
      'Security and surveillance',
      'Medical image analysis',
      'Autonomous vehicles',
      'Retail analytics',
      'Augmented reality'
    ]
  },
  'nlp-text-analytics': {
    parent: 'ai-integration',
    title: 'NLP & Text Analytics',
    description: 'Advanced natural language processing to extract meaning and insights from text data',
    fullDescription: `I build sophisticated Natural Language Processing (NLP) and text analytics solutions that enable businesses to understand, analyze, and derive value from unstructured text data at scale.

My NLP and text analytics services include:

## Core Technologies
- Sentiment analysis and opinion mining
- Entity recognition and extraction
- Text classification and categorization
- Topic modeling and clustering
- Machine translation and language detection
- Summarization and content generation
- Conversational AI and dialogue systems

## Industry Applications
- Marketing: Social media monitoring, campaign analysis, brand sentiment tracking
- Customer Service: Support ticket classification, response suggestion, feedback analysis
- Legal: Contract analysis, compliance checking, legal research assistance
- Healthcare: Medical record analysis, research paper mining, symptom extraction
- Finance: News sentiment analysis, regulatory document processing, risk assessment
- Publishing: Content categorization, automatic tagging, plagiarism detection
- Research: Literature review automation, trend analysis, knowledge extraction

## Key Benefits
- Automated processing of vast text collections
- Consistent and objective text analysis
- Real-time insights from textual data
- Reduced manual document processing
- Scalable language understanding
- Enhanced customer understanding

## Development Process
1. **Requirements Gathering**: Understanding text processing needs
2. **Data Collection**: Assembling relevant text corpuses
3. **Model Selection**: Choosing appropriate algorithms and pre-trained models
4. **Custom Training**: Fine-tuning for domain-specific terminology
5. **Integration**: Connecting with data sources and business systems
6. **Evaluation & Refinement**: Measuring and improving performance

According to Mordor Intelligence, the NLP market is projected to reach $43.9 billion by 2025, with a CAGR of 21.5%. Companies implementing NLP solutions report up to 80% reduction in time spent on document processing and analysis tasks.

From sentiment analysis to automated document processing, I create NLP solutions that transform unstructured text into actionable intelligence, helping your business make better decisions and operate more efficiently.`,
    features: [
      'Sentiment analysis',
      'Entity extraction',
      'Text classification',
      'Topic modeling',
      'Language translation',
      'Summarization engines'
    ],
    benefits: [
      'Automated text processing',
      'Customer sentiment tracking',
      'Content categorization',
      'Information extraction',
      'Reduced manual analysis',
      'Scalable language processing'
    ],
    imageUrl: 'https://images.unsplash.com/photo-1550592704-6c76defa9985?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
    techStack: ['BERT', 'GPT', 'spaCy', 'NLTK', 'Hugging Face Transformers', 'TensorFlow', 'Python', 'ElasticSearch', 'Word Embeddings'],
    stats: [
      { label: 'Text Processing', value: 'Millions of Documents' },
      { label: 'Sentiment Accuracy', value: '92%' },
      { label: 'Analysis Time', value: '-75%' }
    ],
    useCases: [
      'Social media monitoring',
      'Customer feedback analysis',
      'Document classification',
      'Compliance verification',
      'Content recommendation',
      'Automated reporting'
    ]
  },
  'ios-app-development': {
    parent: 'app-development',
    title: 'iOS App Development',
    description: 'Native iOS applications optimized for performance and user experience on Apple devices',
    fullDescription: `I create premium iOS applications that deliver exceptional user experiences while leveraging the full power of Apple's ecosystem, from iPhones and iPads to Apple Watch and Apple TV.

My iOS development services include:

## Technology Stack
- Swift and SwiftUI for modern, native development
- Objective-C for legacy system integration
- UIKit and SwiftUI for responsive interfaces
- CoreData, Realm, or Firebase for data persistence
- ARKit for augmented reality experiences
- Core ML for on-device machine learning
- HealthKit, HomeKit, and other iOS frameworks
- Cocoa Touch and iOS design patterns

## Development Capabilities
- Universal apps (iPhone, iPad, Mac Catalyst)
- Apple Watch extensions
- iMessage apps and stickers
- Widgets and app clips
- Custom animations and transitions
- Push notifications and background processing
- In-app purchases and subscriptions
- App Store optimization

## Key Advantages
- Native performance and fluid animations
- Access to device hardware features
- Adherence to Apple Human Interface Guidelines
- Enhanced security with iOS protections
- Integration with Apple ecosystem services
- Optimized battery consumption
- Regular updates for new iOS features

## Development Process
1. **Discovery**: Understanding business goals and user needs
2. **Wireframing & Design**: Creating iOS-optimized UX/UI
3. **Development**: Building the app with Swift/SwiftUI
4. **Testing**: QA on multiple devices and iOS versions
5. **Deployment**: App Store submission and review
6. **Support**: Ongoing maintenance and iOS updates

According to Statista, iOS users spend 80% more on mobile applications than Android users. Apple's App Store generated approximately $72.3 billion in spending in 2020, making it a lucrative platform for businesses looking to monetize their mobile presence.

From consumer-facing apps to enterprise solutions, I develop iOS applications that align with Apple's design philosophy while delivering unique value to your business and customers.`,
    features: [
      'Native Swift development',
      'SwiftUI modern interfaces',
      'Universal device support',
      'Apple ecosystem integration',
      'Secure data handling',
      'Advanced iOS features'
    ],
    benefits: [
      'Premium user experience',
      'Consistent performance',
      'Apple ecosystem access',
      'Enhanced security',
      'Hardware feature utilization',
      'Higher user spending'
    ],
    imageUrl: 'https://images.unsplash.com/photo-1580910051074-3eb694886505?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
    techStack: ['Swift', 'SwiftUI', 'Objective-C', 'UIKit', 'CoreData', 'ARKit', 'CoreML', 'Xcode', 'CocoaPods', 'SPM'],
    stats: [
      { label: 'App Store Revenue', value: '$72.3B' },
      { label: 'User Retention', value: '+28%' },
      { label: 'Performance', value: 'Native' }
    ],
    useCases: [
      'Business process applications',
      'Consumer lifestyle apps',
      'E-commerce and retail',
      'Health and fitness tracking',
      'Financial and banking services',
      'Entertainment and media streaming'
    ]
  },
  'android-app-development': {
    parent: 'app-development',
    title: 'Android App Development',
    description: 'Feature-rich Android applications built for the world\'s most popular mobile platform',
    fullDescription: `I develop high-quality Android applications that reach the vast global Android user base while delivering optimal performance across the diverse Android device ecosystem.

My Android development services include:

## Technology Stack
- Kotlin and Java for native development
- Jetpack Compose for modern UI development
- Android Architecture Components
- Room, SQLite, or Firebase for data persistence
- Material Design implementation
- Retrofit, OkHttp for networking
- Dagger/Hilt, Koin for dependency injection
- WorkManager for background processing
- Firebase services integration

## Development Capabilities
- Phone and tablet optimized layouts
- Wear OS apps and complications
- Android TV applications
- Android Auto integration
- Custom views and animations
- Background services and workers
- Play Store in-app purchases
- Google Play billing integration

## Key Advantages
- Massive global market reach
- Device and OS version flexibility
- Hardware diversity support
- Background processing capabilities
- Deep system integration options
- Rich notification system
- Lower development costs

## Development Process
1. **Requirements Analysis**: Defining features and technical scope
2. **Design**: Creating Android-optimized interfaces
3. **Development**: Building with Kotlin/Java
4. **Testing**: Device fragmentation testing
5. **Deployment**: Google Play Store publishing
6. **Maintenance**: Updates and OS compatibility

According to Statista, Android holds approximately 72% of the global mobile operating system market share, with over 3 billion active devices worldwide. The platform's reach makes it essential for businesses looking to maximize their mobile application audience.

From consumer applications to enterprise solutions, I develop Android apps that leverage the platform's capabilities while ensuring compatibility across the diverse Android device ecosystem.`,
    features: [
      'Kotlin/Java development',
      'Jetpack Compose interfaces',
      'Material Design implementation',
      'Multi-device compatibility',
      'Background processing',
      'Google services integration'
    ],
    benefits: [
      'Massive market reach',
      'Device ecosystem compatibility',
      'Cost-effective development',
      'Hardware flexibility',
      'Deep OS integration',
      'Rich notification options'
    ],
    imageUrl: 'https://images.unsplash.com/photo-1607252650355-f7fd0460ccdb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
    techStack: ['Kotlin', 'Java', 'Jetpack Compose', 'Android SDK', 'Room', 'Retrofit', 'Dagger/Hilt', 'Firebase', 'Android Studio'],
    stats: [
      { label: 'Global Market Share', value: '72%' },
      { label: 'Active Devices', value: '3B+' },
      { label: 'Device Compatibility', value: '1000+' }
    ],
    useCases: [
      'Enterprise mobility solutions',
      'E-commerce applications',
      'Social networking platforms',
      'Location-based services',
      'Media and entertainment apps',
      'Utility and productivity tools'
    ]
  },
  'cross-platform-development': {
    parent: 'app-development',
    title: 'Cross-Platform App Development',
    description: 'Cost-effective mobile solutions that work seamlessly across iOS, Android, and web platforms',
    fullDescription: `I specialize in cross-platform app development that allows businesses to reach users across multiple platforms with a single codebase, significantly reducing development time and costs.

My cross-platform development services include:

## Technology Options
- React Native for near-native performance
- Flutter for consistent UI across platforms
- Ionic for web-technology based apps
- Xamarin for .NET integration
- Progressive Web Apps (PWAs)
- Capacitor/Cordova for hybrid solutions
- Native modules for platform-specific features

## Development Capabilities
- Shared codebase for iOS and Android
- Responsive web applications
- Platform-specific UI adaptations
- Native API access
- Custom plugins and extensions
- CodePush/OTA updates
- Cross-platform state management

## Key Advantages
- 30-40% reduced development time
- Single team for multiple platforms
- Consistent features across devices
- Simultaneous updates
- Shared business logic
- Easier maintenance and updates
- Faster time-to-market

## Development Process
1. **Platform Strategy**: Selecting optimal cross-platform technology
2. **Unified Design**: Creating adaptable interfaces
3. **Development**: Building the shared codebase
4. **Native Integration**: Adding platform-specific features
5. **Testing**: Cross-platform QA and optimization
6. **Deployment**: Publishing to multiple app stores

According to Statista, cross-platform development tools are used by over 30% of mobile developers worldwide. Businesses report an average of 30-35% cost savings when choosing cross-platform over separate native development efforts.

From startups to enterprises, I help businesses launch consistent experiences across platforms while maximizing development resources and accelerating market entry.`,
    features: [
      'Single codebase development',
      'Native-like performance',
      'Platform-adaptive interfaces',
      'Native API integration',
      'Code sharing (70-90%)',
      'Cross-platform state management'
    ],
    benefits: [
      'Reduced development costs',
      'Faster time-to-market',
      'Consistent cross-platform UX',
      'Simplified maintenance',
      'Wider device reach',
      'Resource optimization'
    ],
    imageUrl: 'https://images.unsplash.com/photo-1551650975-87deedd944c3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2071&q=80',
    techStack: ['React Native', 'Flutter', 'Ionic', 'Xamarin', 'JavaScript/TypeScript', 'Dart', 'PWA', 'Firebase', 'Redux/MobX'],
    stats: [
      { label: 'Development Savings', value: '30-40%' },
      { label: 'Code Reuse', value: '70-90%' },
      { label: 'Market Share', value: '30%' }
    ],
    useCases: [
      'MVP development',
      'Small to medium businesses',
      'Internal corporate apps',
      'Content-focused applications',
      'E-commerce solutions',
      'Service industry applications'
    ]
  },
  'aws-cloud-solutions': {
    parent: 'cloud-services',
    title: 'AWS Cloud Solutions',
    description: 'Scalable and secure infrastructure using Amazon Web Services comprehensive platform',
    fullDescription: `I design and implement comprehensive AWS cloud solutions that enable businesses to leverage Amazon's industry-leading infrastructure for scalability, security, and innovation.

My AWS cloud services include:

## Core Services
- Compute (EC2, Lambda, ECS, Fargate)
- Storage (S3, EBS, EFS, Glacier)
- Databases (RDS, DynamoDB, ElastiCache)
- Networking (VPC, CloudFront, Route 53)
- Security (IAM, WAF, Shield, GuardDuty)
- DevOps (CodePipeline, CodeBuild, CodeDeploy)
- Monitoring (CloudWatch, X-Ray)
- Big Data (EMR, Kinesis, Redshift)

## Solution Areas
- Cloud migration and modernization
- Serverless architecture implementation
- Microservices and container orchestration
- High-availability and disaster recovery
- Auto-scaling and load balancing
- DevOps pipeline automation
- Cost optimization and management
- Cloud security and compliance

## Key Benefits
- Virtually unlimited scalability
- Pay-as-you-go pricing model
- Global infrastructure presence
- Advanced security capabilities
- Integrated monitoring and management
- Continuous innovation access
- Reduced operational overhead

## Implementation Approach
1. **Assessment**: Analyzing current infrastructure and requirements
2. **Architecture Design**: Creating optimized AWS solution
3. **Migration Planning**: Developing transition strategy
4. **Implementation**: Deploying and configuring AWS services
5. **Optimization**: Tuning for performance and cost
6. **Management**: Ongoing support and evolution

According to the IDC, organizations that migrate to AWS achieve a 51% reduction in operations costs, 62% increase in IT staff productivity, and a 94% reduction in downtime. AWS continues to lead the cloud market with over 32% market share.

From startups to enterprises, I help businesses harness the full power of AWS to transform their infrastructure, accelerate innovation, and create competitive advantages.`,
    features: [
      'Comprehensive AWS architecture',
      'Serverless application design',
      'Containerized microservices',
      'High-availability configurations',
      'Auto-scaling implementations',
      'DevOps pipeline automation'
    ],
    benefits: [
      'Unlimited scalability',
      'Reduced operational costs',
      'Enhanced disaster recovery',
      'Global reach capabilities',
      'Improved development velocity',
      'Enterprise-grade security'
    ],
    imageUrl: 'https://images.unsplash.com/photo-1639322537138-5e513100b36e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2232&q=80',
    techStack: ['EC2', 'S3', 'Lambda', 'RDS', 'DynamoDB', 'CloudFront', 'IAM', 'CloudFormation', 'ECS/EKS', 'API Gateway'],
    stats: [
      { label: 'Cost Reduction', value: '51%' },
      { label: 'Staff Productivity', value: '+62%' },
      { label: 'Downtime Reduction', value: '94%' }
    ],
    useCases: [
      'Web application hosting',
      'Data lakes and analytics',
      'Enterprise application migration',
      'IoT backend infrastructure',
      'AI/ML model deployment',
      'Disaster recovery solutions'
    ]
  },
  'azure-cloud-services': {
    parent: 'cloud-services',
    title: 'Azure Cloud Services',
    description: 'Enterprise-grade cloud solutions leveraging Microsoft's powerful Azure platform',
    fullDescription: `I create and implement Microsoft Azure cloud solutions that empower organizations to modernize their infrastructure, harness advanced services, and integrate seamlessly with Microsoft's ecosystem.

My Azure cloud services include:

## Core Services
- Compute (VMs, App Service, Functions)
- Storage (Blob, Files, Disks, Data Lake)
- Databases (SQL Database, Cosmos DB, MySQL)
- Networking (VNet, Load Balancer, CDN)
- Identity (Azure AD, Managed Identities)
- DevOps (Azure DevOps, GitHub Actions)
- AI & Machine Learning (Cognitive Services)
- Analytics (Synapse Analytics, Power BI)

## Solution Areas
- Hybrid cloud architecture
- Azure infrastructure migration
- .NET application modernization
- Business intelligence and analytics
- Microsoft 365 integration
- DevSecOps implementation
- IoT and edge computing
- Governance and cost management

## Key Advantages
- Deep Microsoft ecosystem integration
- Robust enterprise security features
- Advanced compliance certifications
- Hybrid and multi-cloud support
- Integrated development tools
- AI and machine learning services
- Global datacenter presence

## Implementation Methodology
1. **Discovery**: Understanding business needs and existing systems
2. **Architecture**: Designing optimal Azure solution
3. **Migration Strategy**: Planning the transition approach
4. **Deployment**: Implementing Azure services
5. **Integration**: Connecting with existing systems
6. **Optimization**: Enhancing performance and efficiency

According to Microsoft, organizations using Azure see an average 478% ROI over five years, with particular advantages for businesses already using Microsoft technologies. Azure has grown to become the second-largest cloud provider with approximately 20% market share.

From small businesses to global enterprises, I help organizations leverage Azure's capabilities to drive innovation, improve operational efficiency, and create scalable solutions that grow with your business.`,
    features: [
      'Azure infrastructure design',
      'Hybrid cloud connectivity',
      'PaaS application modernization',
      'Azure DevOps implementation',
      'Identity and access management',
      'Business intelligence solutions'
    ],
    benefits: [
      'Microsoft ecosystem integration',
      'Enterprise-grade security',
      'Comprehensive compliance',
      'Simplified hybrid cloud',
      'Integrated development tools',
      'Advanced analytics capabilities'
    ],
    imageUrl: 'https://images.unsplash.com/photo-1631624221190-37678a7e811f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2069&q=80',
    techStack: ['Azure VMs', 'App Service', 'Azure Functions', 'Azure SQL', 'Cosmos DB', 'Azure AD', 'Azure DevOps', 'Cognitive Services', 'Logic Apps'],
    stats: [
      { label: 'Average ROI', value: '478%' },
      { label: 'Market Share', value: '~20%' },
      { label: 'Global Regions', value: '60+' }
    ],
    useCases: [
      'Enterprise application modernization',
      'Microsoft-centric organizations',
      'Hybrid cloud implementations',
      'Business intelligence solutions',
      'Regulated industries (healthcare, finance)',
      'IoT and edge computing solutions'
    ]
  },
  'google-cloud-platform': {
    parent: 'cloud-services',
    title: 'Google Cloud Platform',
    description: 'Advanced cloud infrastructure and machine learning capabilities powered by Google technology',
    fullDescription: `I design and implement Google Cloud Platform (GCP) solutions that enable organizations to leverage Google's cutting-edge infrastructure, data analytics, and machine learning capabilities.

My Google Cloud services include:

## Core Services
- Compute (Compute Engine, GKE, Cloud Run)
- Storage (Cloud Storage, Filestore)
- Databases (Cloud SQL, Firestore, Bigtable)
- Networking (VPC, Cloud CDN, Cloud Load Balancing)
- Big Data (BigQuery, Dataflow, Pub/Sub)
- Machine Learning (Vertex AI, AutoML)
- DevOps (Cloud Build, Cloud Deploy)
- Security (IAM, Security Command Center)

## Solution Areas
- Cloud-native application development
- Kubernetes orchestration and management
- Data warehousing and analytics
- Machine learning model deployment
- Serverless architecture implementation
- DevOps and CI/CD pipeline automation
- Global content delivery
- High-performance computing

## Key Benefits
- Superior data analytics capabilities
- World-class machine learning infrastructure
- High-performance global network
- Kubernetes expertise
- Innovative serverless options
- Pay-per-use pricing model
- Environmental sustainability

## Implementation Process
1. **Assessment**: Evaluating requirements and opportunities
2. **Architecture**: Designing GCP-optimized solution
3. **Migration Plan**: Creating transition roadmap
4. **Implementation**: Deploying GCP services
5. **Optimization**: Tuning performance and costs
6. **Management**: Ongoing support and evolution

According to CLIP Research, organizations using Google Cloud Platform see an average of 19.3% infrastructure cost savings and a 26.4% increase in application development efficiency. GCP is particularly strong in data analytics, with BigQuery processing terabytes of data with unmatched speed.

From startups to enterprises, I help organizations harness Google Cloud's strengths to build innovative, scalable, and data-driven solutions that transform business capabilities.`,
    features: [
      'GCP infrastructure architecture',
      'Kubernetes deployment (GKE)',
      'BigQuery data warehousing',
      'Machine learning implementation',
      'Serverless application design',
      'Global load balancing'
    ],
    benefits: [
      'Advanced analytics capabilities',
      'Superior ML infrastructure',
      'Global network performance',
      'Streamlined container management',
      'Cost-effective scaling',
      'Innovative cloud services'
    ],
    imageUrl: 'https://images.unsplash.com/photo-1573164713714-d95e436ab8d6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2069&q=80',
    techStack: ['Compute Engine', 'Google Kubernetes Engine', 'Cloud Run', 'BigQuery', 'Firestore', 'Cloud Storage', 'Vertex AI', 'Cloud Build', 'Pub/Sub'],
    stats: [
      { label: 'Cost Savings', value: '19.3%' },
      { label: 'Dev Efficiency', value: '+26.4%' },
      { label: 'Network Performance', value: 'Premium' }
    ],
    useCases: [
      'Data-intensive applications',
      'Machine learning projects',
      'Containerized microservices',
      'Global content delivery',
      'Real-time analytics',
      'Healthcare and life sciences'
    ]
  }
};

const SubServiceLandingPage = () => {
  const [match, params] = useRoute('/:parentSlug/:subServiceSlug');
  const [_, setLocation] = useLocation();
  const parentSlug = params?.parentSlug || '';
  const subServiceSlug = params?.subServiceSlug || '';

  // Fetch parent service details
  const { data: parentService, isLoading: isParentLoading } = useQuery<Service>({
    queryKey: [`/api/services/${parentSlug}`],
    enabled: !!parentSlug,
  });

  // Get sub-service data
  const subService = subServiceData[subServiceSlug];

  // Track page view
  useEffect(() => {
    if (subService) {
      trackEvent('view_subservice_page', 'subservice', subService.title);
    }
  }, [subService]);

  // Redirect if sub-service not found
  useEffect(() => {
    if (!isParentLoading && !subService) {
      setLocation(`/${parentSlug}`);
    }
  }, [isParentLoading, subService, parentSlug, setLocation]);

  if (isParentLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!subService) {
    return null;
  }

  // Parse markdown-like content in fullDescription
  const formatDescription = (text: string) => {
    return text
      .split('\n\n')
      .map((paragraph, idx) => {
        // Handle headers
        if (paragraph.startsWith('## ')) {
          return (
            <h3 key={idx} className="text-xl font-bold mt-6 mb-3 text-primary">
              {paragraph.replace('## ', '')}
            </h3>
          );
        }
        
        // Handle lists
        else if (paragraph.includes('\n- ')) {
          const [listTitle, ...items] = paragraph.split('\n- ');
          return (
            <div key={idx} className="mb-4">
              {listTitle && <p className="mb-2">{listTitle}</p>}
              <ul className="list-disc pl-5 space-y-1">
                {items.map((item, itemIdx) => (
                  <li key={itemIdx}>{item}</li>
                ))}
              </ul>
            </div>
          );
        }
        
        // Regular paragraphs
        return (
          <p key={idx} className="mb-4">
            {paragraph}
          </p>
        );
      });
  };

  return (
    <>
      <Helmet>
        <title>{subService.title} | Samuel Marndi - Professional Web Developer</title>
        <meta name="description" content={subService.description} />
        <meta property="og:title" content={`${subService.title} | Samuel Marndi`} />
        <meta property="og:description" content={subService.description} />
        <meta property="og:type" content="website" />
        <meta property="og:image" content={subService.imageUrl} />
      </Helmet>

      {/* Hero Section */}
      <section className="relative py-16 md:py-24 bg-gradient-to-br from-background via-background to-accent/5">
        <div className="container px-4 mx-auto">
          <div className="flex flex-col md:flex-row md:items-center md:space-x-12">
            <motion.div 
              className="md:w-1/2 mb-8 md:mb-0"
              initial="hidden"
              animate="visible"
              variants={fadeIn}
            >
              <div className="inline-block mb-3">
                <Link 
                  to={`/${parentSlug}`} 
                  className="text-sm text-muted-foreground hover:text-primary flex items-center"
                >
                  <ArrowRight className="h-3 w-3 mr-1 rotate-180" />
                  Back to {parentService?.title || 'Services'}
                </Link>
              </div>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 text-foreground">
                {subService.title}
              </h1>
              <p className="text-xl text-muted-foreground mb-6">
                {subService.description}
              </p>
              <div className="flex flex-wrap gap-3">
                <QuickQuoteModal
                  buttonText="Get a Free Quote"
                  selectedService={`${subService.title}`}
                  modalTitle={`Request ${subService.title} Service`}
                  className="bg-primary hover:bg-primary/90"
                />
                <Button 
                  variant="outline" 
                  onClick={() => window.open('https://wa.me/918280320550', '_blank')}
                >
                  Discuss Your Project
                </Button>
              </div>
            </motion.div>
            <motion.div 
              className="md:w-1/2"
              initial="hidden"
              animate="visible"
              variants={fadeIn}
            >
              <div className="relative rounded-lg overflow-hidden shadow-xl border border-border">
                <OptimizedImage
                  src={subService.imageUrl}
                  alt={subService.title}
                  width={600}
                  height={400}
                  className="w-full h-auto object-cover rounded-lg"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Technology Stack */}
      <section className="py-16 bg-accent/5">
        <div className="container px-4 mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-8 text-foreground">
            Technology Stack
          </h2>
          <motion.div 
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4"
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
          >
            {subService.techStack.map((tech, index) => (
              <motion.div 
                key={index}
                className="bg-card text-card-foreground rounded-lg p-4 text-center shadow-sm hover:shadow-md transition-shadow border border-border"
                variants={fadeIn}
              >
                <p className="font-medium">{tech}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Main Content Section */}
      <section className="py-16">
        <div className="container px-4 mx-auto">
          <div className="flex flex-col lg:flex-row lg:space-x-12">
            {/* Left Content */}
            <div className="lg:w-2/3">
              <h2 className="text-2xl md:text-3xl font-bold mb-6 text-foreground">
                {subService.title} Services
              </h2>
              <div className="prose prose-lg dark:prose-invert max-w-none">
                {formatDescription(subService.fullDescription)}
              </div>
              
              {/* Statistics Grid */}
              <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
                {subService.stats.map((stat, index) => (
                  <motion.div 
                    key={index}
                    className="bg-card border border-border rounded-lg p-6 text-center"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    viewport={{ once: true }}
                  >
                    <p className="text-4xl font-bold text-primary mb-2">{stat.value}</p>
                    <p className="text-muted-foreground">{stat.label}</p>
                  </motion.div>
                ))}
              </div>
            </div>
            
            {/* Right Sidebar */}
            <div className="lg:w-1/3 mt-12 lg:mt-0">
              {/* Features */}
              <div className="bg-card border border-border rounded-lg p-6 mb-8">
                <h3 className="text-xl font-bold mb-4 flex items-center">
                  <Star className="h-5 w-5 mr-2 text-yellow-500" />
                  Key Features
                </h3>
                <ul className="space-y-3">
                  {subService.features.map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <Check className="h-5 w-5 mr-2 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              {/* Benefits */}
              <div className="bg-card border border-border rounded-lg p-6 mb-8">
                <h3 className="text-xl font-bold mb-4 flex items-center">
                  <Award className="h-5 w-5 mr-2 text-primary" />
                  Benefits
                </h3>
                <ul className="space-y-3">
                  {subService.benefits.map((benefit, index) => (
                    <li key={index} className="flex items-start">
                      <Check className="h-5 w-5 mr-2 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              {/* Use Cases */}
              <div className="bg-card border border-border rounded-lg p-6">
                <h3 className="text-xl font-bold mb-4 flex items-center">
                  <Zap className="h-5 w-5 mr-2 text-blue-500" />
                  Common Use Cases
                </h3>
                <ul className="space-y-3">
                  {subService.useCases.map((useCase, index) => (
                    <li key={index} className="flex items-start">
                      <Check className="h-5 w-5 mr-2 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>{useCase}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary text-primary-foreground">
        <div className="container px-4 mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            Ready to enhance your business with {subService.title}?
          </h2>
          <p className="text-lg mb-8 max-w-2xl mx-auto opacity-90">
            Let's discuss how I can help you implement cutting-edge {subService.title.toLowerCase()} solutions tailored to your specific business needs.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <QuickQuoteModal
              buttonText="Get Started Today"
              selectedService={`${subService.title}`}
              modalTitle={`Request ${subService.title} Service`}
              className="bg-white text-primary hover:bg-white/90"
            />
            <Button 
              variant="outline" 
              className="border-white text-white hover:bg-white/10"
              onClick={() => window.open('https://wa.me/918280320550', '_blank')}
            >
              Contact via WhatsApp
            </Button>
          </div>
        </div>
      </section>

      {/* Related Services */}
      <section className="py-16">
        <div className="container px-4 mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-8">
            Related Services
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Object.entries(subServiceData)
              .filter(([slug, data]) => data.parent === parentSlug && slug !== subServiceSlug)
              .slice(0, 3)
              .map(([slug, data]) => (
                <motion.div
                  key={slug}
                  className="bg-card border border-border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all"
                  whileHover={{ y: -5 }}
                >
                  <Link to={`/${parentSlug}/${slug}`}>
                    <div className="h-48 overflow-hidden">
                      <OptimizedImage
                        src={data.imageUrl}
                        alt={data.title}
                        width={400}
                        height={200}
                        className="w-full h-full object-cover transition-transform hover:scale-105"
                      />
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-bold mb-2">{data.title}</h3>
                      <p className="text-muted-foreground mb-4">{data.description}</p>
                      <div className="flex items-center font-medium text-primary">
                        Learn more <ArrowRight className="ml-2 h-4 w-4" />
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))
            }
          </div>
        </div>
      </section>
    </>
  );
};

export default SubServiceLandingPage;