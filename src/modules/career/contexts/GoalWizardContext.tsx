import React, { createContext, useContext, useState, ReactNode } from 'react';
import { GoalWizardDialog } from '@/modules/career/components/goal/GoalWizardDialog';
import { GoalWizardProps } from '@/modules/career/components/goal/GoalWizard';

interface GoalWizardContextType {
    openGoalWizard: (initialState?: GoalWizardProps['initialState']) => void;
    closeGoalWizard: () => void;
}

const GoalWizardContext = createContext<GoalWizardContextType | undefined>(undefined);

export const GoalWizardProvider = ({ children }: { children: ReactNode }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [initialState, setInitialState] = useState<GoalWizardProps['initialState']>(null);

    const openGoalWizard = (state: GoalWizardProps['initialState'] = null) => {
        setInitialState(state);
        setIsOpen(true);
    };

    const closeGoalWizard = () => {
        setIsOpen(false);
        // Short delay to clear state after animation, to prevent flashing empty fields
        setTimeout(() => setInitialState(null), 300);
    };

    return (
        <GoalWizardContext.Provider value={{ openGoalWizard, closeGoalWizard }}>
            {children}
            <GoalWizardDialog
                open={isOpen}
                onOpenChange={setIsOpen}
                initialState={initialState}
                onSuccess={() => {
                    // Success is handled inside GoalWizard currently (navigation)
                    // But we can add extra handling here if needed
                    setIsOpen(false);
                }}
            />
        </GoalWizardContext.Provider>
    );
};

export const useGoalWizard = () => {
    const context = useContext(GoalWizardContext);
    if (context === undefined) {
        throw new Error('useGoalWizard must be used within a GoalWizardProvider');
    }
    return context;
};
