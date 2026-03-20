import { Suspense, lazy, useState, memo } from 'react';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, Tooltip, Dialog, DialogTitle, DialogContent, Typography, IconButton
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import BrowserUpdatedIcon from '@mui/icons-material/BrowserUpdated';
import { daysFromToday } from '../utils/dataTransformers';
import { useI18n } from '../contexts/I18nContext';

const DownloadTableExcel = lazy(() => 
  import('react-export-table-to-excel').then(mod => ({ default: mod.DownloadTableExcel }))
);

type AudienceExperimentsDialogProps = {
    open: boolean;
    selected: any;
    onClose: () => void;
};

const AudienceExperimentsDialog: React.FC<AudienceExperimentsDialogProps> = memo(({ open, selected, onClose }) => {
    const { t } = useI18n();
    const [tableRef, setTableRef] = useState<HTMLTableElement | null>(null);
    
    return (
        <Dialog open={open} maxWidth='xl' onClose={onClose} fullWidth>
            <DialogTitle>
                {t('audienceExperiments.dialogTitle', { audienceName: selected?.name || '' })} ({selected?.audId})
                <IconButton
                    aria-label={t('common.close')}
                    onClick={onClose}
                    sx={{ position: "absolute", insetInlineEnd: 8, top: 8 }}
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
                            <Tooltip title={t('audienceExperiments.exportButton')}>
                                <IconButton
                                    aria-label={t('common.download')}
                                    color="primary"
                                    sx={{ position: "absolute", insetInlineEnd: 58, top: 8 }}
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
                                    <TableCell><strong>{t('audienceExperiments.experimentName')}</strong></TableCell>
                                    <TableCell><strong>{t('audienceExperiments.experimentId')}</strong></TableCell>
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
                    <Typography>{t('audienceExperiments.noExperiments')}</Typography>
                )}
            </DialogContent>
        </Dialog>
    );
});

AudienceExperimentsDialog.displayName = 'AudienceExperimentsDialog';

export default AudienceExperimentsDialog;