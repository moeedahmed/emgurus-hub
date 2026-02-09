import React, { createContext, useContext, useState, ReactNode } from 'react';
import { PathwayWizardDialog } from '@/modules/career/components/pathway/PathwayWizardDialog';
import { PathwayWizardProps } from '@/modules/career/components/pathway/PathwayWizard';

interface PathwayWizardContextType {
    openPathwayWizard: (initialState?: PathwayWizardProps['initialState']) => void;
    closePathwayWizard: () => void;
}

const PathwayWizardContext = createContext<PathwayWizardContextType | undefined>(undefined);

export const PathwayWizardProvider = ({ children }: { children: ReactNode }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [initialState, setInitialState] = useState<PathwayWizardProps['initialState']>(null);

    const openPathwayWizard = (state: PathwayWizardProps['initialState'] = null) => {
        setInitialState(state);
        setIsOpen(true);
    };

    const closePathwayWizard = () => {
        setIsOpen(false);
        setTimeout(() => setInitialState(null), 300);
    };

    return (
        <PathwayWizardContext.Provider value={{ openPathwayWizard, closePathwayWizard }}>
            {children}
            <PathwayWizardDialog
                open={isOpen}
                onOpenChange={setIsOpen}
                initialState={initialState}
                onSuccess={() => {
                    setIsOpen(false);
                }}
            />
        </PathwayWizardContext.Provider>
    );
};

export const usePathwayWizard = () => {
    const context = useContext(PathwayWizardContext);
    if (context === undefined) {
        throw new Error('usePathwayWizard must be used within a PathwayWizardProvider');
    }
    return context;
};
