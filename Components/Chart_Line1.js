// has hower working 
// line chart


import React, { useState, useRef, useEffect } from 'react';
import { 
  View, 
  Dimensions, 
  PanResponder,
  Text,
  StyleSheet
} from 'react-native';
import Svg, { 
  Path, 
  Line, 
  Text as SvgText, 
  G, 
  Circle, 
  Rect 
} from 'react-native-svg';

const { width, height } = Dimensions.get('window');

const LineChart = () => {
  const [tooltipData, setTooltipData] = useState(null);
  const [tooltipPosition, setTooltipPosition] = useState(null);
  const svgRef = useRef(null);

  // Comprehensive data points
  const data = [
    { x: 0, y: 50, label: 'Jan' },
    { x: 1, y: 80, label: 'Feb' },
    { x: 2, y: 90, label: 'Mar' },
    { x: 3, y: 70, label: 'Apr' },
    { x: 4, y: 60, label: 'May' }
  ];

  // Chart configuration
  const chartWidth = width * 0.9;
  const chartHeight = height * 0.4;
  const padding = 40;

  // Advanced scaling functions
  const calculateScaleY = (data) => {
    const maxY = Math.max(...data.map(d => d.y));
    const minY = Math.min(...data.map(d => d.y));
    return { 
      maxY, 
      minY, 
      scaleFunction: (value) => 
        chartHeight - padding - ((value - minY) / (maxY - minY)) * (chartHeight - 2 * padding)
    };
  };

  const { maxY, minY, scaleFunction: scaleY } = calculateScaleY(data);

  const scaleX = (index) => 
    padding + (index / (data.length - 1)) * (chartWidth - 2 * padding);

  // Line path generation
  const generateLinePath = () => {
    return data.map((point, index) => {
      const x = scaleX(index);
      const y = scaleY(point.y);
      return index === 0 ? `M${x},${y}` : `L${x},${y}`;
    }).join(' ');
  };

  // Pan Responder for smooth cursor tracking
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderMove: (event, gestureState) => {
        const { moveX, moveY } = gestureState;
        
        // Find closest data point
        const closestPoint = data.reduce((prev, curr) => {
          const prevX = scaleX(data.indexOf(prev));
          const currX = scaleX(data.indexOf(curr));
          return (Math.abs(prevX - moveX) < Math.abs(currX - moveX)) ? prev : curr;
        });

        setTooltipData(closestPoint);
        setTooltipPosition({
          x: scaleX(data.indexOf(closestPoint)),
          y: scaleY(closestPoint.y)
        });
      },
      onPanResponderRelease: () => {
        setTooltipData(null);
        setTooltipPosition(null);
      }
    })
  ).current;

  return (
    <View 
      style={styles.container}
      {...panResponder.panHandlers}
    >
      <Svg 
        width={chartWidth} 
        height={chartHeight}
        ref={svgRef}
      >
        {/* Y-Axis */}
        <Line
          x1={padding}
          y1={padding}
          x2={padding}
          y2={chartHeight - padding}
          stroke="black"
          strokeWidth="2"
        />

        {/* X-Axis */}
        <Line
          x1={padding}
          y1={chartHeight - padding}
          x2={chartWidth - padding}
          y2={chartHeight - padding}
          stroke="black"
          strokeWidth="2"
        />

        {/* Y-Axis Labels */}
        {[minY, (minY + maxY) / 2, maxY].map((label, index) => {
          const y = scaleY(label);
          return (
            <G key={index}>
              <SvgText 
                x={padding - 30} 
                y={y} 
                fontSize="12" 
                fill="black"
              >
                {Math.round(label)}
              </SvgText>
              <Line
                x1={padding - 5}
                y1={y}
                x2={padding}
                y2={y}
                stroke="black"
                strokeWidth="1"
              />
            </G>
          );
        })}

        {/* Line Path */}
        <Path
          d={generateLinePath()}
          fill="none"
          stroke="blue"
          strokeWidth="2"
        />

        {/* Data Points */}
        {data.map((point, index) => {
          const x = scaleX(index);
          const y = scaleY(point.y);
          return (
            <G key={index}>
              <Circle
                cx={x}
                cy={y}
                r="8"
                fill="red"
              />
            </G>
          );
        })}

        {/* Tooltip */}
        {tooltipData && tooltipPosition && (
          <G>
            {/* Vertical Line */}
            <Line
              x1={tooltipPosition.x}
              y1={padding}
              x2={tooltipPosition.x}
              y2={chartHeight - padding}
              stroke="gray"
              strokeWidth="2"
              strokeDasharray="5,5"
            />

            {/* Tooltip Background */}
            <Rect
              x={tooltipPosition.x - 40}
              y={tooltipPosition.y - 40}
              width="75"
              height="30"
              fill="white"
              stroke="gray"
              strokeWidth="1"
              rx="10"
            />

            {/* Tooltip Text */}
            <SvgText
              x={tooltipPosition.x}
              y={tooltipPosition.y - 24}
              textAnchor="middle"
              fontSize="11"
              fill="black"
            >
              {`${tooltipData.label}: ${tooltipData.y}`}
            </SvgText>
          </G>
        )}
      </Svg>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height:600

  }
});

export default LineChart;
