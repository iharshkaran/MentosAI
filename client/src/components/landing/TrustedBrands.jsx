import { motion } from "motion/react";

const TrustedBrands = () => {
    return (
        <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="w-full text-center mt-20 mb-12"
        >
            <p className="text-sm font-medium text-zinc-500 mb-8">
                Built for the teams redefining national security & intelligence
            </p>
            <div className="flex flex-wrap justify-center items-center gap-x-12 gap-y-6 opacity-60 grayscale">
                <span className="font-serif text-xl font-bold">NTRO</span>
                <span className="font-sans text-xl font-bold tracking-tighter">CyberCell</span>
                <span className="font-serif text-xl italic">CERT-In</span>
                <span className="font-sans text-xl font-bold uppercase tracking-widest">DRDO</span>
            </div>
        </motion.div>
    );
};

export default TrustedBrands;