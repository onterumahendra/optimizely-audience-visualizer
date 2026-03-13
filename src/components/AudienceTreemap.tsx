import { useState, useEffect, useMemo, memo, lazy, Suspense } from "react";
import { Treemap, Tooltip, ResponsiveContainer } from "recharts";
import TuneIcon from '@mui/icons-material/Tune';
import BrowserUpdatedRoundedIcon from '@mui/icons-material/BrowserUpdatedRounded';
import { colorBins, getBinColor } from '../constants/treemapColors';
import { AudienceModel, TreemapCellData } from '../types';

// Lazy load heavy components
const AudienceExperimentsDialog = lazy(() => import('./AudienceExperimentsDialog'));
const AudienceFilterDialog = lazy(() => import('./AudienceFilterDialog'));
const ColorLegend = lazy(() => import('./ColorLegend'));

// Component Props
type AudienceTreemapProps = {
    audiences: AudienceModel[];
};

// Download handler - separated for reusability
async function downloadTreemapAsPNG() {
    const treemapContainer = document.getElementById('treeMapContainer');
    if (!treemapContainer) return;
    
    try {
        const html2canvas = (await import('html2canvas')).default;
        const canvas = await html2canvas(treemapContainer as HTMLElement);
        const link = document.createElement('a');
        link.href = canvas.toDataURL('image/png');
        
        let prefix = 'audience-treemap';
        const projectStr = sessionStorage.getItem('optimizely_active_project') || '{}';
        try {
            const { name } = JSON.parse(projectStr);
            if (typeof name === 'string' && name.trim()) {
                prefix = `${name}-audience-treemap`;
            }
        } catch { }
        
        link.download = `${prefix}.png`;
        link.click();
    } catch (err) {
        alert('Failed to download treemap.');
    }
}

const AudienceTreemap: React.FC<AudienceTreemapProps> = memo(({ audiences }) => {
    const [tileTooltip, setTileTooltip] = useState<{ x: number; y: number; content: string } | null>(null);
    const [filterModalOpen, setFilterModalOpen] = useState(false);
    const [audienceFilter, setAudienceFilter] = useState('');
    const [selectedAudienceNames, setSelectedAudienceNames] = useState<string[]>(() => audiences.map(aud => aud.name));
    const [selectedCell, setSelectedCell] = useState<TreemapCellData | null>(null);

    // Update selected audiences when audiences prop changes
    useEffect(() => {
        setSelectedAudienceNames(audiences.map(aud => aud.name));
    }, [audiences]);

    // Memoized audience names for filtering
    const allAudienceNames = useMemo(() => audiences.map(aud => aud.name), [audiences]);

    // Memoized filtered audiences
    const displayedAudiences = useMemo(() => 
        audiences.filter(aud => selectedAudienceNames.includes(aud.name)),
        [audiences, selectedAudienceNames]
    );

    // Memoized treemap data with transformed structure
    const treemapData = useMemo(() => {
        const values = displayedAudiences.map(aud => aud.experiments.length);
        const min = 1;
        const max = Math.max(...values, 1);

        return {
            data: displayedAudiences.map(aud => ({
                name: aud.name,
                value: aud.experiments.length,
                audId: aud.audId,
                experiments: aud.experiments,
                fill: getBinColor(aud.experiments.length, min, max)
            })).sort((a, b) => b.value - a.value),
            min,
            max
        };
    }, [displayedAudiences]);

    const handleFilterApply = () => {
        setFilterModalOpen(false);
        if (selectedAudienceNames.length === 0) {
            setSelectedAudienceNames(audiences.map(aud => aud.name));
        }
    };

    return (
        <>
            <div style={{ display: 'flex', paddingBottom: '16px', width: '100%', justifyContent: 'center', alignItems: 'center' }}>
                <Suspense fallback={<div style={{ flex: 1 }} />}>
                    <ColorLegend colorBins={colorBins} min={treemapData.min} max={treemapData.max} />
                </Suspense>
                <div style={{ width: 80, minWidth: 80, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <TuneIcon 
                        aria-label="filter" 
                        color="primary" 
                        sx={{ cursor: 'pointer' }} 
                        onClick={() => setFilterModalOpen(true)} 
                    />
                    <BrowserUpdatedRoundedIcon 
                        aria-label="download" 
                        color="primary" 
                        sx={{ cursor: 'pointer' }} 
                        onClick={downloadTreemapAsPNG} 
                    />
                </div>
            </div>
            
            <ResponsiveContainer width="100%" height={500} id="treeMapContainer">
                <Treemap
                    data={treemapData.data}
                    dataKey="value"
                    nameKey="name"
                    stroke="#fff"
                    fill="#8884d8"
                    content={({ x, y, width, height, name, value, fill }) => {
                        // Find the full data for this cell
                        const cellData = treemapData.data.find(d => d.name === name);
                        
                        const maxTextLength = Math.floor(width / 9);
                        const displayName = name.length > maxTextLength
                            ? name.slice(0, maxTextLength - 3) + "..."
                            : name;
                        
                        const handleMouseOver = (evt: React.MouseEvent) => {
                            setTileTooltip({
                                x: evt.clientX,
                                y: evt.clientY,
                                content: `${name}\u00A0\u00A0(${value})`
                            });
                        };
                        const handleMouseOut = () => setTileTooltip(null);
                        
                        return (
                            <g>
                                <rect
                                    x={x}
                                    y={y}
                                    width={width}
                                    height={height}
                                    fill={typeof fill === "string" ? fill : "#8884d8"}
                                    stroke="#000"
                                    style={{ cursor: "pointer" }}
                                    onClick={() => cellData && setSelectedCell(cellData)}
                                    onMouseOver={handleMouseOver}
                                    onMouseMove={handleMouseOver}
                                    onMouseOut={handleMouseOut}
                                />
                                <text
                                    x={Math.round(x + width / 2)}
                                    y={Math.round(y + height / 2) - 4}
                                    textAnchor="middle"
                                    dominantBaseline="middle"
                                    fontSize={14}
                                    fill="#000"
                                    stroke="#000"
                                    strokeWidth={0.2}
                                    fontWeight='normal'
                                    style={{ userSelect: "none", pointerEvents: "none" }}
                                >
                                    {displayName}
                                </text>
                                <text
                                    x={Math.round(x + width / 2)}
                                    y={Math.round(y + height / 2) + 12}
                                    textAnchor="middle"
                                    dominantBaseline="middle"
                                    fontSize={14}
                                    fill="#000"
                                    stroke="#000"
                                    strokeWidth={0.2}
                                    style={{ userSelect: "none", pointerEvents: "none" }}
                                >
                                    {value}
                                </text>
                            </g>
                        );
                    }}
                />
                <Tooltip formatter={(value: any, name: any) => [`Experiments: ${value}`, name]} />
                {tileTooltip && (
                    <div
                        style={{
                            position: 'fixed',
                            left: tileTooltip.x + 12,
                            top: tileTooltip.y + 12,
                            background: 'rgba(30,30,30,0.95)',
                            color: '#fff',
                            padding: '6px 12px',
                            borderRadius: 6,
                            fontSize: 14,
                            pointerEvents: 'none',
                            zIndex: 2000,
                            boxShadow: '0 2px 8px rgba(0,0,0,0.18)'
                        }}
                    >
                        {tileTooltip.content}
                    </div>
                )}
            </ResponsiveContainer>

            <Suspense fallback={null}>
                {selectedCell && (
                    <AudienceExperimentsDialog
                        open={!!selectedCell}
                        selected={selectedCell}
                        onClose={() => setSelectedCell(null)}
                    />
                )}

                <AudienceFilterDialog
                    open={filterModalOpen}
                    allAudienceNames={allAudienceNames}
                    selectedNames={selectedAudienceNames}
                    filterText={audienceFilter}
                    onFilterChange={setAudienceFilter}
                    onSelectionChange={setSelectedAudienceNames}
                    onClose={() => setFilterModalOpen(false)}
                    onApply={handleFilterApply}
                />
            </Suspense>
        </>
    );
});

AudienceTreemap.displayName = 'AudienceTreemap';

export default AudienceTreemap;
