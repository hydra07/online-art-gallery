'use client';

import { useTheme } from 'next-themes';
import { useEffect, useRef, useState } from 'react';
import { WalletStatistics } from '@/types/payment';

interface SummaryData {
	totalInflow: number;
	totalOutflow: number;
	totalTransactions: number;
}
interface BalanceChartProps {
    statistics?: WalletStatistics;
    isLoading?: boolean;
}

export function BalanceChart({ statistics, isLoading = false }: BalanceChartProps) {
    const { theme } = useTheme();
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [chartMode, setChartMode] = useState<'combined' | 'separate'>('combined');

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas || isLoading || !statistics) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const isDark = theme === 'dark';
        const width = canvas.width;
        const height = canvas.height;

        // Clear canvas
        ctx.clearRect(0, 0, width, height);

        // Set colors based on theme
        const gridColor = isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)';
        const inflowColor = isDark ? '#22c55e' : '#10b981'; // Green for inflow
        const outflowColor = isDark ? '#ef4444' : '#f43f5e'; // Red for outflow
        const netFlowColor = isDark ? '#4f46e5' : '#6366f1'; // Primary color for net
        const transactionColor = isDark ? '#f59e0b' : '#f59e0b'; // Amber for transactions

        // Extract time series data
        const timeSeriesData = statistics.timeSeries || [];
        
        if (timeSeriesData.length === 0) {
            // Display "No data available" message
            drawNoDataMessage(ctx, width, height, isDark);
            return;
        }

        // Extract data from time series
        const labels = timeSeriesData.map(item => item._id);
        const inflowData = timeSeriesData.map(item => item.inflow);
        const outflowData = timeSeriesData.map(item => item.outflow);
        const netFlowData = timeSeriesData.map(item => item.inflow - item.outflow);
        const transactionsData = timeSeriesData.map(item => item.transactions);

        // Draw background grid
        drawGrid(ctx, width, height, gridColor);

        if (chartMode === 'combined') {
            // Draw combined chart showing net flow with transactions as bars
            drawCombinedChart(
                ctx, width, height, isDark, 
                labels, netFlowData, transactionsData,
                netFlowColor, transactionColor
            );
        } else {
            // Draw separate lines for inflow and outflow
            drawSeparateChart(
                ctx, width, height, isDark,
                labels, inflowData, outflowData, transactionsData,
                inflowColor, outflowColor, transactionColor
            );
        }

        // Add legend
        drawLegend(ctx, width, height, isDark, chartMode, inflowColor, outflowColor, netFlowColor, transactionColor);

    }, [theme, statistics, isLoading, chartMode]);

    // Function to draw background grid
    function drawGrid(ctx: CanvasRenderingContext2D, width: number, height: number, gridColor: string) {
        ctx.strokeStyle = gridColor;
        ctx.lineWidth = 0.5;

        // Horizontal grid lines
        for (let i = 0; i < 5; i++) {
            const y = i * (height / 4);
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(width, y);
            ctx.stroke();
        }

        // Vertical grid lines (optional)
        for (let i = 0; i < 5; i++) {
            const x = i * (width / 4);
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, height);
            ctx.stroke();
        }
    }

    // Function to draw a combined chart (netFlow line + transaction bars)
    function drawCombinedChart(
        ctx: CanvasRenderingContext2D, 
        width: number, 
        height: number, 
        isDark: boolean,
        labels: string[],
        netFlowData: number[],
        transactionsData: number[],
        netFlowColor: string,
        transactionColor: string
    ) {
        // Find max values for scaling
        const maxNetFlow = Math.max(...netFlowData.map(Math.abs), 1);
        const minNetFlow = Math.min(0, ...netFlowData);
        const flowRange = maxNetFlow - minNetFlow;
        
        const maxTransactions = Math.max(...transactionsData, 1);

        // Chart area dimensions (leave space for axis and labels)
        const chartTop = 20; // Space for top labels
        const chartBottom = height - 25; // Space for bottom labels
        const chartHeight = chartBottom - chartTop;

        // Draw transaction bars first (in background)
        const barWidth = Math.min(30, (width / labels.length) * 0.6);
        
        transactionsData.forEach((transactions, index) => {
            const x = (index / (labels.length - 1 || 1)) * width;
            const barHeight = (transactions / maxTransactions) * (chartHeight * 0.3); // Use 30% of chart height
            
            ctx.fillStyle = `${transactionColor}50`; // 30% opacity
            ctx.fillRect(
                x - barWidth/2, 
                chartBottom - barHeight,
                barWidth, 
                barHeight
            );
        });

        // Draw net flow line
        ctx.strokeStyle = netFlowColor;
        ctx.lineWidth = 2;
        ctx.beginPath();

        netFlowData.forEach((value, index) => {
            const x = (index / (labels.length - 1 || 1)) * width;
            const y = chartBottom - ((value - minNetFlow) / flowRange) * (chartHeight * 0.7);
            
            if (index === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
        });

        ctx.stroke();

        // Draw area fill under the line
        const gradient = ctx.createLinearGradient(0, chartTop, 0, chartBottom);
        gradient.addColorStop(0, `${netFlowColor}50`); // 30% opacity
        gradient.addColorStop(1, `${netFlowColor}00`); // 0% opacity

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.moveTo(0, chartBottom);

        netFlowData.forEach((value, index) => {
            const x = (index / (labels.length - 1 || 1)) * width;
            const y = chartBottom - ((value - minNetFlow) / flowRange) * (chartHeight * 0.7);
            ctx.lineTo(x, y);
        });

        ctx.lineTo(width, chartBottom);
        ctx.closePath();
        ctx.fill();

        // Draw date labels
        drawDateLabels(ctx, labels, width, height, isDark);

        // Draw Y-axis labels for net flow (left side)
        ctx.font = '10px sans-serif';
        ctx.fillStyle = isDark ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.7)';
        ctx.textAlign = 'left';
        
        // Draw min and max values on left Y-axis
        ctx.fillText(formatCurrency(maxNetFlow), 5, chartTop + 10);
        ctx.fillText(formatCurrency(minNetFlow), 5, chartBottom - 5);
        
        // Draw Y-axis label for transactions (right side)
        ctx.textAlign = 'right';
        ctx.fillText(`${maxTransactions} txns`, width - 5, chartTop + 10);
        ctx.fillText('0 txns', width - 5, chartBottom - 5);
    }

    // Function to draw separate lines for inflow and outflow
    function drawSeparateChart(
        ctx: CanvasRenderingContext2D, 
        width: number, 
        height: number, 
        isDark: boolean,
        labels: string[],
        inflowData: number[],
        outflowData: number[],
        transactionsData: number[],
        inflowColor: string,
        outflowColor: string,
        transactionColor: string
    ) {
        // Find max values for scaling
        const maxFlow = Math.max(...inflowData, ...outflowData, 1);
        const maxTransactions = Math.max(...transactionsData, 1);

        // Chart area dimensions
        const chartTop = 20;
        const chartBottom = height - 25;
        const chartHeight = chartBottom - chartTop;

        // Draw inflow line
        drawLine(ctx, inflowData, width, chartTop, chartBottom, maxFlow, inflowColor);
        
        // Draw outflow line
        drawLine(ctx, outflowData, width, chartTop, chartBottom, maxFlow, outflowColor);

        // Draw transaction markers (small circles)
        transactionsData.forEach((transactions, index) => {
            const x = (index / (labels.length - 1 || 1)) * width;
            const y = chartBottom - (transactions / maxTransactions) * chartHeight;
            
            ctx.fillStyle = transactionColor;
            ctx.beginPath();
            ctx.arc(x, y, 3, 0, Math.PI * 2);
            ctx.fill();
        });

        // Draw date labels
        drawDateLabels(ctx, labels, width, height, isDark);

        // Draw Y-axis labels
        ctx.font = '10px sans-serif';
        ctx.fillStyle = isDark ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.7)';
        ctx.textAlign = 'left';
        
        // Draw min and max values on left Y-axis
        ctx.fillText(formatCurrency(maxFlow), 5, chartTop + 10);
        ctx.fillText('0', 5, chartBottom - 5);
        
        // Draw Y-axis label for transactions (right side)
        ctx.textAlign = 'right';
        ctx.fillText(`${maxTransactions} txns`, width - 5, chartTop + 10);
    }

    // Function to draw a single line
    function drawLine(
        ctx: CanvasRenderingContext2D, 
        data: number[], 
        width: number, 
        chartTop: number, 
        chartBottom: number, 
        maxValue: number, 
        color: string
    ) {
        if (data.length === 0) return;
        
        const chartHeight = chartBottom - chartTop;
        
        ctx.strokeStyle = color;
        ctx.lineWidth = 2;
        ctx.beginPath();

        data.forEach((value, index) => {
            const x = (index / (data.length - 1 || 1)) * width;
            const y = chartBottom - (value / maxValue) * chartHeight;
            
            if (index === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
        });

        ctx.stroke();
    }

    // Function to draw date labels
    function drawDateLabels(
        ctx: CanvasRenderingContext2D, 
        labels: string[], 
        width: number, 
        height: number, 
        isDark: boolean
    ) {
        ctx.font = '10px sans-serif';
        ctx.fillStyle = isDark ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.7)';
        ctx.textAlign = 'center';

        // Determine how many labels to show based on width
        const maxLabels = Math.min(labels.length, 5);
        
        if (labels.length <= maxLabels) {
            // Show all labels if there are few enough
            labels.forEach((label, index) => {
                const x = (index / (labels.length - 1 || 1)) * width;
                ctx.fillText(formatLabel(label), x, height - 5);
            });
        } else {
            // Show subset of labels
            const interval = Math.ceil(labels.length / maxLabels);
            
            for (let i = 0; i < labels.length; i += interval) {
                const x = (i / (labels.length - 1)) * width;
                ctx.fillText(formatLabel(labels[i]), x, height - 5);
            }
            
            // Always show the last label
            if ((labels.length - 1) % interval !== 0) {
                const x = width;
                ctx.fillText(formatLabel(labels[labels.length - 1]), x, height - 5);
            }
        }
    }

    // Function to format label based on its format (could be YYYY-MM or other formats)
    function formatLabel(label: string): string {
        if (!label) return '';
        
        if (label.includes('-')) {
            try {
                // Handle YYYY-MM format
                const [year, month] = label.split('-');
                if (year && month) {
                    const date = new Date(parseInt(year), parseInt(month) - 1);
                    return date.toLocaleDateString(undefined, { month: 'short', year: '2-digit' });
                }
            } catch (error) {
                console.error("Error formatting date label:", error);
            }
        }
        return label;
    }

    // Format currency values with proper type safety
    function formatCurrency(value: number): string {
        if (!isFinite(value)) return '0';
        
        if (value >= 1000000) {
            return `${(value / 1000000).toFixed(1)}M`;
        } else if (value >= 1000) {
            return `${(value / 1000).toFixed(1)}K`;
        }
        return value.toString();
    }

    // Draw legend for the chart
    function drawLegend(
        ctx: CanvasRenderingContext2D, 
        width: number, 
        height: number, 
        isDark: boolean,
        mode: 'combined' | 'separate',
        inflowColor: string,
        outflowColor: string,
        netFlowColor: string,
        transactionColor: string
    ) {
        const legendY = 10;
        ctx.font = '9px sans-serif';
        ctx.textAlign = 'left';
        ctx.fillStyle = isDark ? 'rgba(255, 255, 255, 0.9)' : 'rgba(0, 0, 0, 0.9)';
        
        if (mode === 'combined') {
            // Draw legend for net flow
            ctx.fillStyle = netFlowColor;
            ctx.fillRect(width - 150, legendY, 10, 2);
            ctx.fillStyle = isDark ? 'rgba(255, 255, 255, 0.9)' : 'rgba(0, 0, 0, 0.9)';
            ctx.fillText('Net Flow', width - 135, legendY + 4);
            
            // Draw legend for transactions
            ctx.fillStyle = `${transactionColor}50`;
            ctx.fillRect(width - 80, legendY - 3, 10, 8);
            ctx.fillStyle = isDark ? 'rgba(255, 255, 255, 0.9)' : 'rgba(0, 0, 0, 0.9)';
            ctx.fillText('Transactions', width - 65, legendY + 4);
        } else {
            // Draw legend for inflow
            ctx.fillStyle = inflowColor;
            ctx.fillRect(width - 150, legendY, 10, 2);
            ctx.fillStyle = isDark ? 'rgba(255, 255, 255, 0.9)' : 'rgba(0, 0, 0, 0.9)';
            ctx.fillText('Inflow', width - 135, legendY + 4);
            
            // Draw legend for outflow
            ctx.fillStyle = outflowColor;
            ctx.fillRect(width - 80, legendY, 10, 2);
            ctx.fillStyle = isDark ? 'rgba(255, 255, 255, 0.9)' : 'rgba(0, 0, 0, 0.9)';
            ctx.fillText('Outflow', width - 65, legendY + 4);
        }
    }

    // Function to display "No data" message
    function drawNoDataMessage(
        ctx: CanvasRenderingContext2D, 
        width: number, 
        height: number, 
        isDark: boolean
    ) {
        ctx.font = '14px sans-serif';
        ctx.fillStyle = isDark ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.7)';
        ctx.textAlign = 'center';
        ctx.fillText('No data available for this period', width / 2, height / 2);
    }

    if (isLoading) {
        return (
            <div className="w-full h-full flex items-center justify-center">
                <p className="text-muted-foreground text-sm">Loading chart data...</p>
            </div>
        );
    }

    return (
        <div className="w-full h-full">
            {/* Toggle button for chart mode */}
            <div className="flex justify-end mb-2">
                <button 
                    onClick={() => setChartMode(mode => mode === 'combined' ? 'separate' : 'combined')}
                    className="text-xs text-muted-foreground underline"
                >
                    Switch to {chartMode === 'combined' ? 'detailed' : 'simple'} view
                </button>
            </div>
            <canvas
                ref={canvasRef}
                width={600}
                height={180}
                className="w-full h-full"
            />
        </div>
    );
}
