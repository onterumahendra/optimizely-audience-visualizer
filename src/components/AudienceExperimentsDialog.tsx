import { Suspense, lazy, useState, memo } from 'react';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, Tooltip, Dialog, DialogTitle, DialogContent, Typography, IconButton
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import BrowserUpdatedIcon from '@mui/icons-material/BrowserUpdated';
import { daysFromToday } from '../utils/dataTransformers';
import { TreemapCellData } from '../types';

const DownloadTableExcel = lazy(() => 
  import('react-export-table-to-excel').then(mod => ({ default: mod.DownloadTableExcel }))
);

type AudienceExperimentsDialogProps = {
    open: boolean;
    selected: TreemapCellData | null;
    onClose: () => void;
};

const AudienceExperimentsDialog: React.FC<AudienceExperimentsDialogProps> = memo(({ open, selected, onClose }) => {
    const [tableRef, setTableRef] = useState<HTMLTableElement | null>(null);
    
    return (
        <Dialog open={open} maxWidth='xl' onClose={onClose} fullWidth>
            <DialogTitle>
                Experiments for Audience: {selected?.name} ({selected?.audId})
                <IconButton
                    aria-label="close"
                    onClick={onClose}
                    sx={{ position: "absolute", right: 8, top: 8 }}
                    size="large">
                    <CloseIcon />
                </IconButton>
                {selected && selected.experiments && selected.experiments.length > 0 && (
                    <Suspense fallback={null}>
                        <DownloadTableExcel
                            filename={`experiments_audience_${selected.audId || 'unknown'}`}
                            sheet="Experiments"
                            currentTableRef={tableRef}
                        >
                            <Tooltip title="Download as Excel">
                                <IconButton
                                    aria-label="download-excel"
                                    color="primary"
                                    sx={{ position: "absolute", right: 58, top: 8 }}
                                    size="large"
                                >
                                    <BrowserUpdatedIcon />
                                </IconButton>
                            </Tooltip>
                        </DownloadTableExcel>
                    </Suspense>
                )}
            </DialogTitle>
            <DialogContent dividers>
                {selected && selected.experiments && selected.experiments.length > 0 ? (
                    <TableContainer component={Paper}>
                        <Table ref={setTableRef}>
                            <TableHead>
                                <TableRow >
                                    <TableCell><strong>Experiment Name</strong></TableCell>
                                    <TableCell><strong>Experiment Id</strong></TableCell>
                                    <TableCell><strong>Days Running</strong></TableCell>
                                    <TableCell><strong>Variations</strong></TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {selected.experiments.map((exp: any, idx: number) => (
                                    <TableRow key={idx}>
                                        <TableCell>{exp.name}</TableCell>
                                        <TableCell>{exp.id}</TableCell>
                                        <TableCell>{daysFromToday(exp.last_modified)}</TableCell>
                                        <TableCell>{
                                            exp?.variations?.length
                                                ? exp.variations.map((v: any) => `${v.name} (${v.weight / 100}%)`).join(', ')
                                                : '--'
                                        }</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                ) : (
                    <Typography>No running experiments for this audience.</Typography>
                )}
            </DialogContent>
        </Dialog>
    );
});

AudienceExperimentsDialog.displayName = 'AudienceExperimentsDialog';

export default AudienceExperimentsDialog;