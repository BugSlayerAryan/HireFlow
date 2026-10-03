import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function StatCard({ title, value, icon, bgClass }) {
    const [count, setCount] = useState(0);

    useEffect(() => {
        let start = 0;
        const stringValue = String(value || "0");
        const numericValue = parseInt(stringValue.replace(/[^0-9]/g, '')) || 0;
        const isPercent = stringValue.includes('%');

        const duration = 1000;
        const increment = Math.ceil(numericValue / (duration / 20)) || 1;

        const timer = setInterval(() => {
            start += increment;
            if (start >= numericValue) {
                setCount(isPercent ? `${numericValue}%` : numericValue);
                clearInterval(timer);
            } else {
                setCount(isPercent ? `${start}%` : start);
            }
        }, 20);

        return () => clearInterval(timer);
    }, [value]);

    const finalBg = bgClass.endsWith('-soft') ? bgClass : `${bgClass}-soft`;

    return (
        <motion.div
            className="stat-card"
            whileHover={{ y: -8, scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300 }}
        >
            <div className={`icon-wrapper ${finalBg}`}>{icon}</div>
            <h5>{title}</h5>
            <div className="value">{count}</div>
        </motion.div>
    );
}


