import { useProfile } from '@/modules/career/hooks/useProfile';
import { motion } from 'framer-motion';

export function GreetingHeader() {
    const { data: profile } = useProfile();

    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return "Good morning";
        if (hour < 18) return "Good afternoon";
        return "Good evening";
    };

    const getFirstName = () => {
        if (!profile?.display_name) return "there";
        return profile.display_name.split(' ')[0];
    };

    return (
        <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8"
        >
            <h1 className="text-3xl md:text-4xl font-display font-bold text-foreground tracking-tight mb-2">
                {getGreeting()}, <span className="text-primary italic">{getFirstName()}</span>.
            </h1>
            <p className="text-muted-foreground text-sm md:text-base max-w-lg leading-relaxed">
                Let's pick up where you left off. Every step counts toward your career goals.
            </p>
        </motion.div>
    );
}
