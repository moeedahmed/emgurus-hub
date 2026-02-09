import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { Drawer, DrawerContent, DrawerTrigger } from '@/components/ui/drawer';
import { useMediaQuery } from '@/modules/career/hooks/use-media-query';
import { GoalWizard, GoalWizardProps } from './GoalWizard';
import { useState } from 'react';

interface GoalWizardDialogProps extends GoalWizardProps {
    children?: React.ReactNode;
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
}

export const GoalWizardDialog = ({
    children,
    open: controlledOpen,
    onOpenChange: setControlledOpen,
    onSuccess,
    ...wizardProps
}: GoalWizardDialogProps) => {
    const [uncontrolledOpen, setUncontrolledOpen] = useState(false);
    const isDesktop = useMediaQuery("(min-width: 768px)");

    const open = controlledOpen ?? uncontrolledOpen;
    const setOpen = setControlledOpen ?? setUncontrolledOpen;

    const handleSuccess = () => {
        onSuccess?.();
        setOpen(false);
    };

    if (isDesktop) {
        return (
            <Dialog open={open} onOpenChange={setOpen}>
                {children && <DialogTrigger asChild>{children}</DialogTrigger>}
                <DialogContent className="sm:max-w-[600px] max-h-[85vh] p-0 gap-0 overflow-hidden bg-background flex flex-col">
                    <GoalWizard onSuccess={handleSuccess} onCancel={() => setOpen(false)} {...wizardProps} />
                </DialogContent>
            </Dialog>
        );
    }

    return (
        <Drawer open={open} onOpenChange={setOpen}>
            {children && <DrawerTrigger asChild>{children}</DrawerTrigger>}
            <DrawerContent className="h-[90vh]">
                <GoalWizard onSuccess={handleSuccess} onCancel={() => setOpen(false)} {...wizardProps} />
            </DrawerContent>
        </Drawer>
    );
};
