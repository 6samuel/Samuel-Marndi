import React from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';

interface FunnelStage {
  name: string;
  value: number;
  percent: number;
  color: string;
}

interface FunnelChartProps {
  title?: string;
  description?: string;
  data: FunnelStage[];
  height?: number;
  className?: string;
}

const FunnelChart: React.FC<FunnelChartProps> = ({ 
  title, 
  description, 
  data, 
  height = 300,
  className = ''
}) => {
  // Ensure the data is sorted in descending order by value
  const sortedData = [...data].sort((a, b) => b.value - a.value);
  const maxValue = sortedData[0]?.value || 0;
  
  return (
    <Card className={className}>
      {(title || description) && (
        <CardHeader>
          {title && <CardTitle>{title}</CardTitle>}
          {description && <CardDescription>{description}</CardDescription>}
        </CardHeader>
      )}
      <CardContent>
        <div style={{ height: `${height}px`, position: 'relative' }}>
          {sortedData.map((stage, index) => {
            // Calculate the width percentage based on the stage value
            const widthPercent = maxValue > 0 ? (stage.value / maxValue) * 100 : 0;
            
            // Calculate the top position for the stage
            const stageHeight = (height - 40) / sortedData.length;
            const top = index * stageHeight;
            
            // Center the stage as a trapezoid
            const leftOffset = (100 - widthPercent) / 2;
            
            return (
              <div key={stage.name} className="relative" style={{ height: `${stageHeight}px` }}>
                <div 
                  className="absolute transition-all duration-500 ease-in-out"
                  style={{
                    height: `${stageHeight - 8}px`,
                    width: `${widthPercent}%`,
                    left: `${leftOffset}%`,
                    backgroundColor: stage.color,
                    borderRadius: '4px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontWeight: 'bold',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    fontSize: '0.875rem',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                  }}
                >
                  {stage.value > 0 && (
                    <div className="flex items-center gap-2 px-3">
                      <span>{stage.name}</span>
                      <span>({stage.value})</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
          
          {/* Vertical axis on the right showing percentages */}
          <div className="absolute top-0 right-0 h-full flex flex-col justify-between text-xs text-muted-foreground">
            {sortedData.map((stage, index) => (
              <div 
                key={`percent-${index}`} 
                className="flex items-center gap-2"
                style={{ 
                  position: 'absolute',
                  top: `${index * ((height - 40) / sortedData.length) + ((height - 40) / sortedData.length / 2) - 10}px`,
                  right: 0
                }}
              >
                <span>{stage.percent}%</span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default FunnelChart;