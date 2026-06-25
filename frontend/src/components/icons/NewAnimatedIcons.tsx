/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect } from "react";
import { motion, useAnimation, type TargetAndTransition } from "framer-motion";
import { useIconAnimation } from "../../hooks/icons/useIconAnimation";
import type { AnimatedIconProps, IconWrapperProps } from "../../types";

const IconWrapper = ({
    children,
    controls,
    size = 28,
    color = "currentColor",
    strokeWidth = 1.5,
    variants,
    className,
    style
}: IconWrapperProps) => (
    <div
        className={className}
        style={{ display: "flex", alignItems: "center", justifyContent: "center", ...style }}
        onMouseEnter={() => controls.start("animate")}
        onMouseLeave={() => controls.start("normal")}
    >
        <motion.svg
            animate={controls}
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeLinejoin="round"
            initial="normal"
            variants={variants}
            style={style}
        >
            {children}
        </motion.svg>
    </div>
);

const SPRING_TRANS = { type: "spring", stiffness: 50, damping: 10 } as const;
const SLIDER_SPRING = { type: "spring", stiffness: 100, damping: 12, mass: 0.4 } as const;

export const AnimatedBotMessageSquare = ({ isHovered, ...props }: AnimatedIconProps) => {
    const controls = useIconAnimation(isHovered);
    return (
        <IconWrapper
            controls={controls} {...props}
            variants={{
                normal: { rotate: 0, y: 0, scale: 1 },
                animate: { rotate: [0, -3, 3, 0], y: [0, 1.5, -1.5, 0], scale: [1, 1.03, 1], transition: { duration: 1 } }
            }}
        >
            <path d="M12 6V2H8" /><path d="M2 12h2" /><path d="M20 12h2" />
            <motion.path
                d="M20 16a2 2 0 0 1-2 2H8.828a2 2 0 0 0-1.414.586l-2.202 2.202A.71.71 0 0 1 4 20.286V8a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2z"
                variants={{ normal: { scale: 1 }, animate: { scale: [1, 1.04, 1], transition: { duration: 0.6, repeat: 1 } } }}
            />
            <motion.path d="M9 11v2" variants={{ normal: { scaleY: 1 }, animate: { scaleY: [1, 0.1, 1], transition: { duration: 0.4, delay: 0.1 } } }} />
            <motion.path d="M15 11v2" variants={{ normal: { scaleY: 1 }, animate: { scaleY: [1, 0.1, 1], transition: { duration: 0.4, delay: 0.2 } } }} />
        </IconWrapper>
    );
};

export const AnimatedWrench = ({ isHovered, ...props }: AnimatedIconProps) => {
    const controls = useIconAnimation(isHovered);
    return (
        <IconWrapper
            controls={controls} {...props}
            style={{ transformOrigin: "90% 10%" }}
            variants={{
                normal: { rotate: 0 },
                animate: { rotate: [0, 12, -14, 4, 0], transition: { duration: 1.05 } }
            }}
        >
            <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.106-3.105c.32-.322.863-.22.983.218a6 6 0 0 1-8.259 7.057l-7.91 7.91a1 1 0 0 1-2.999-3l7.91-7.91a6 6 0 0 1 7.057-8.259c.438.12.54.662.219.984z" />
        </IconWrapper>
    );
};

export const AnimatedFileCog = ({ isHovered, ...props }: AnimatedIconProps) => {
    const controls = useIconAnimation(isHovered);
    return (
        <IconWrapper controls={controls} {...props}>
            <path d="M14 2v4a2 2 0 0 0 2 2h4" />
            <path d="M4.677 21.5a2 2 0 0 0 1.313.5H18a2 2 0 0 0 2-2V7l-5-5H6a2 2 0 0 0-2 2v2.5" />
            <motion.g
                variants={{ normal: { rotate: 0 }, animate: { rotate: 180 } }}
                transition={SPRING_TRANS}
                style={{ transformOrigin: "6px 14px" }}
            >
                <path d="m3.2 12.9-.9-.4" /><path d="m3.2 15.1-.9.4" /><path d="m4.9 11.2-.4-.9" />
                <path d="m4.9 16.8-.4.9" /><path d="m7.5 10.3-.4.9" /><path d="m7.5 17.7-.4-.9" />
                <path d="m9.7 12.5-.9.4" /><path d="m9.7 15.5-.9-.4" /><circle cx="6" cy="14" r="3" />
            </motion.g>
        </IconWrapper>
    );
};

export const AnimatedFolderCog = ({ isHovered, ...props }: AnimatedIconProps) => {
    const controls = useIconAnimation(isHovered);
    return (
        <IconWrapper controls={controls} {...props}>
            <path d="M10.3 20H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h3.98a2 2 0 0 1 1.69.9l.66 1.2A2 2 0 0 0 12 6h8a2 2 0 0 1 2 2v3.3" />
            <motion.g
                variants={{ normal: { rotate: 0 }, animate: { rotate: 180 } }}
                transition={SPRING_TRANS}
                style={{ transformOrigin: "18px 18px" }}
            >
                <path d="m14.305 19.53.923-.382" /><path d="m15.228 16.852-.923-.383" />
                <path d="m16.852 15.228-.383-.923" /><path d="m16.852 20.772-.383.924" />
                <path d="m19.148 15.228.383-.923" /><path d="m19.53 21.696-.382-.924" />
                <path d="m20.772 16.852.924-.383" /><path d="m20.772 19.148.924.383" /><circle cx="18" cy="18" r="3" />
            </motion.g>
        </IconWrapper>
    );
};

export const AnimatedAirplay = ({ isHovered, ...props }: AnimatedIconProps) => {
    const controls = useIconAnimation(isHovered);
    return (
        <IconWrapper controls={controls} {...props}>
            <motion.path
                d="M5 17H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2h-1"
                variants={{ normal: { opacity: 1, pathLength: 1 }, animate: { opacity: [0, 1], pathLength: [0, 1], transition: { duration: 0.6 } } }}
            />
            <motion.path
                d="M12 15l5 6H7z"
                style={{ transformOrigin: "center" }}
                variants={{ normal: { scale: 1, opacity: 1 }, animate: { scale: [0.6, 1.1, 1], opacity: [0, 1], transition: { duration: 0.6 } } }}
            />
        </IconWrapper>
    );
};

export const AnimatedClipboardCheck = ({ isHovered, ...props }: AnimatedIconProps) => {
    const controls = useIconAnimation(isHovered);
    return (
        <IconWrapper controls={controls} {...props}>
            <rect height="4" rx="1" ry="1" width="8" x="8" y="2" />
            <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
            <motion.path
                d="m9 14 2 2 4-4"
                variants={{ normal: { pathLength: 1, opacity: 1 }, animate: { pathLength: [0, 1], opacity: [0, 1], transition: { duration: 0.3 } } }}
            />
        </IconWrapper>
    );
};

export const AnimatedCircleCheck = ({ isHovered, ...props }: AnimatedIconProps) => {
    const controls = useIconAnimation(isHovered ?? true);
    return (
        <IconWrapper controls={controls} {...props}>
            <circle cx="12" cy="12" r="10" />
            <motion.path
                d="m9 12 2 2 4-4"
                variants={{ normal: { opacity: 1, pathLength: 1 }, animate: { opacity: [0, 1], pathLength: [0, 1], transition: { duration: 0.4 } } }}
            />
        </IconWrapper>
    );
};

export const AnimatedFeather = ({ isHovered, ...props }: AnimatedIconProps) => {
    const controls = useIconAnimation(isHovered);
    return (
        <IconWrapper
            controls={controls} {...props}
            variants={{
                normal: { rotate: 0, y: 0, x: 0 },
                animate: { rotate: [0, -8, 4, 0], y: [0, -4, 0], x: [0, 2, 0], transition: { duration: 1.6 } }
            }}
        >
            <path d="M12.67 19a2 2 0 0 0 1.416-.588l6.154-6.172a6 6 0 0 0-8.49-8.49L5.586 9.914A2 2 0 0 0 5 11.328V18a1 1 0 0 0 1 1z" />
            <path d="M16 8 2 22" /><path d="M17.5 15H9" />
        </IconWrapper>
    );
};

export const AnimatedArrowBigUpDash = ({ isHovered, ...props }: AnimatedIconProps) => {
    const controls = useIconAnimation(isHovered);
    return (
        <IconWrapper controls={controls} {...props}>
            <motion.path d="M9 19h6" variants={{ normal: { y: 0 }, animate: { y: [0, -1, 0], transition: { duration: 0.4 } } }} />
            <motion.path d="M9 15v-3H5l7-7 7 7h-4v3H9z" variants={{ normal: { y: 0 }, animate: { y: [0, -3, 0], transition: { duration: 0.4 } } }} />
        </IconWrapper>
    );
};

export const AnimatedFileCheck2 = ({ isHovered, ...props }: AnimatedIconProps) => {
    const controls = useIconAnimation(isHovered);
    return (
        <IconWrapper controls={controls} {...props}>
            <path d="M14 2v4a2 2 0 0 0 2 2h4" /><path d="M4 22h14a2 2 0 0 0 2-2V7l-5-5H6a2 2 0 0 0-2 2v4" />
            <motion.path
                d="m3 15 2 2 4-4"
                style={{ transformOrigin: "center" }}
                variants={{ normal: { pathLength: 1, opacity: 1 }, animate: { pathLength: [0, 1], opacity: [0, 1], transition: { duration: 0.4 } } }}
            />
        </IconWrapper>
    );
};

export const AnimatedSun = ({ isHovered, ...props }: AnimatedIconProps) => {
    const controls = useIconAnimation(isHovered);
    return (
        <IconWrapper controls={controls} {...props}>
            <circle cx="12" cy="12" r="4" />
            {["M12 2v2", "m19.07 4.93-1.41 1.41", "M20 12h2", "m17.66 17.66 1.41 1.41", "M12 20v2", "m6.34 17.66-1.41 1.41", "M2 12h2", "m4.93 4.93 1.41 1.41"].map((d, i) => (
                <motion.path key={d} d={d} variants={{ normal: { opacity: 1 }, animate: { opacity: [0, 1], transition: { delay: i * 0.1 } } }} />
            ))}
        </IconWrapper>
    );
};

export const AnimatedSunMoon = ({ isHovered, ...props }: AnimatedIconProps) => {
    const controls = useIconAnimation(isHovered);
    return (
        <IconWrapper controls={controls} {...props}>
            <motion.g variants={{ normal: { rotate: 0 }, animate: { rotate: [0, -5, 5, 0], transition: { duration: 1.5 } } }}>
                <path d="M12 8a2.83 2.83 0 0 0 4 4 4 4 0 1 1-4-4" />
            </motion.g>
            {["M12 2v2", "M12 20v2", "m4.9 4.9 1.4 1.4", "m17.7 17.7 1.4 1.4", "M2 12h2", "M20 12h2", "m6.3 17.7-1.4 1.4", "m19.1 4.9-1.4 1.4"].map((d, i) => (
                <motion.path key={d} d={d} variants={{ normal: { opacity: 1 }, animate: { opacity: [0, 1], transition: { delay: i * 0.1 } } }} />
            ))}
        </IconWrapper>
    );
};

export const AnimatedUser = ({ isHovered, ...props }: AnimatedIconProps) => {
    const controls = useIconAnimation(isHovered);
    return (
        <IconWrapper controls={controls} {...props}>
            <motion.circle cx="12" cy="8" r="5" variants={{ normal: { pathLength: 1, scale: 1 }, animate: { pathLength: [0, 1], scale: [0.5, 1] } }} />
            <motion.path d="M20 21a8 8 0 0 0-16 0" variants={{ normal: { pathLength: 1, opacity: 1 }, animate: { pathLength: [0, 1], opacity: [0, 1], transition: { delay: 0.2 } } }} />
        </IconWrapper>
    );
};

export const AnimatedArrowBigLeftDash = ({ isHovered, ...props }: AnimatedIconProps) => {
    const controls = useIconAnimation(isHovered);
    return (
        <IconWrapper controls={controls} {...props}>
            <motion.path d="M19 15V9" variants={{ normal: { x: 0 }, animate: { x: [0, -1, 0], transition: { duration: 0.4 } } }} />
            <motion.path d="M15 15h-3v4l-7-7 7-7v4h3v6z" variants={{ normal: { x: 0 }, animate: { x: [0, -3, 0], transition: { duration: 0.4 } } }} />
        </IconWrapper>
    );
};

export const AnimatedEye = ({ isHovered, ...props }: AnimatedIconProps) => {
    const controls = useIconAnimation(isHovered);
    const eyeVar = { normal: { scaleY: 1, opacity: 1 }, animate: { scaleY: [1, 0.1, 1], opacity: [1, 0.3, 1], transition: { duration: 0.4 } } };
    return (
        <IconWrapper controls={controls} {...props}>
            <motion.path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0" style={{ originY: "50%" }} variants={eyeVar} />
            <motion.circle cx="12" cy="12" r="3" variants={{ normal: { scale: 1 }, animate: { scale: [1, 0.3, 1], transition: { duration: 0.4 } } }} />
        </IconWrapper>
    );
};

export const AnimatedGalleryHorizontalEnd = ({ isHovered, ...props }: AnimatedIconProps) => {
    const controls = useIconAnimation(isHovered);
    const hVar = (i: number) => ({ normal: { x: 0, opacity: 1 }, animate: { x: [2 * i, 0], opacity: [0, 1], transition: { delay: 0.25 * (2 - i) } } });
    return (
        <IconWrapper controls={controls} {...props}>
            <motion.path d="M6 5v14" variants={hVar(2)} /><motion.path d="M2 7v10" variants={hVar(1)} /><rect height="18" rx="2" width="12" x="10" y="3" />
        </IconWrapper>
    );
};

export const AnimatedGalleryVerticalEnd = ({ isHovered, ...props }: AnimatedIconProps) => {
    const controls = useIconAnimation(isHovered);
    const vVar = (i: number) => ({ normal: { y: 0, opacity: 1 }, animate: { y: [2 * i, 0], opacity: [0, 1], transition: { delay: 0.25 * (2 - i) } } });
    return (
        <IconWrapper controls={controls} {...props}>
            <motion.path d="M7 2h10" variants={vVar(1)} /><motion.path d="M5 6h14" variants={vVar(2)} /><rect height="12" rx="2" width="18" x="3" y="10" />
        </IconWrapper>
    );
};

export const AnimatedLayoutPanelTop = ({ isHovered, ...props }: AnimatedIconProps) => {
    const controls = useIconAnimation(isHovered);

    useEffect(() => {
        const animateOnMount = async () => {
            await controls.start("animate");
            controls.start("normal");
        };
        animateOnMount();
    }, [controls]);

    return (
        <IconWrapper controls={controls} {...props}>
            <motion.rect
                height="7" rx="1" width="18" x="3" y="3"
                variants={{
                    normal: { opacity: 1, y: 0 },
                    animate: { opacity: [0, 1], y: [-5, 0], transition: { duration: 0.5 } }
                } as any}
            />
            <motion.rect
                height="7" rx="1" width="7" x="3" y="14"
                variants={{
                    normal: { opacity: 1, x: 0 },
                    animate: { opacity: [0, 1], x: [-10, 0], transition: { duration: 0.5, delay: 0.15 } }
                } as any}
            />
            <motion.rect
                height="7" rx="1" width="7" x="14" y="14"
                variants={{
                    normal: { opacity: 1, x: 0 },
                    animate: { opacity: [0, 1], x: [10, 0], transition: { duration: 0.5, delay: 0.3 } }
                } as any}
            />
        </IconWrapper>
    );
};

export const AnimatedEyeLogin = ({ isHovered, ...props }: AnimatedIconProps) => {
    const controls = useIconAnimation(isHovered);
    return (
        <IconWrapper controls={controls} {...props} size={20}>
            <motion.path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0" style={{ originY: "50%" }} variants={{ normal: { scaleY: 1 }, animate: { scaleY: [1, 0.1, 1], transition: { duration: 0.4 } } }} />
            <motion.circle cx="12" cy="12" r="3" variants={{ normal: { scale: 1 }, animate: { scale: [1, 0.3, 1], transition: { duration: 0.4 } } }} />
        </IconWrapper>
    );
};

export const AnimatedEyeOff = ({ isHovered, ...props }: AnimatedIconProps) => {
    const controls = useIconAnimation(isHovered);
    return (
        <IconWrapper controls={controls} {...props} size={20}>
            <path d="M10.733 5.076a10.744 10.744 0 0 1 11.205 6.575 1 1 0 0 1 0 .696 10.747 10.747 0 0 1-1.444 2.49" />
            <path d="M14.084 14.158a3 3 0 0 1-4.242-4.242" />
            <path d="M17.479 17.499a10.75 10.75 0 0 1-15.417-5.151 1 1 0 0 1 0-.696 10.75 10.75 0 0 1 4.446-5.143" />
            <motion.path d="m2 2 20 20" variants={{ normal: { pathLength: 1, opacity: 1 }, animate: { pathLength: [0, 1.2], opacity: [0, 1], transition: { duration: 0.6 } } }} />
        </IconWrapper>
    );
};

export const AnimatedLockKeyholeOpen = ({ isHovered, ...props }: AnimatedIconProps) => {
    const controls = useIconAnimation(isHovered ?? true);
    return (
        <IconWrapper
            controls={controls} {...props}
            variants={{ normal: { rotate: 0, scale: 1 }, animate: { rotate: [0, -5, 5, 0], scale: [1, 1.1, 1], transition: { duration: 1 } } }}
        >
            <circle cx="12" cy="16" r="1" /><rect height="12" rx="2" width="18" x="3" y="10" />
            <motion.path d="M7 10V7a5 5 0 0 1 10 0v3" variants={{ normal: { pathLength: 1 }, animate: { pathLength: [0, 1], transition: { duration: 0.8 } } }} />
        </IconWrapper>
    );
};

export const AnimatedUserRoundPlus = ({ isHovered, ...props }: AnimatedIconProps) => {
    const controls = useIconAnimation(isHovered ?? true);
    return (
        <IconWrapper controls={controls} {...props}>
            <path d="M2 21a8 8 0 0 1 13.292-6" /><circle cx="10" cy="8" r="5" />
            <motion.path d="M19 16v6" variants={{ normal: { opacity: 1, pathLength: 1 }, animate: { opacity: [0, 1], pathLength: [0, 1], transition: { delay: 0.3 } } }} />
            <motion.path d="M22 19h-6" variants={{ normal: { opacity: 1, pathLength: 1 }, animate: { opacity: [0, 1], pathLength: [0, 1], transition: { delay: 0.6 } } }} />
        </IconWrapper>
    );
};

export const AnimatedCctv = ({ isHovered, ...props }: AnimatedIconProps) => {
    const controls = useIconAnimation(isHovered);
    return (
        <IconWrapper controls={controls} {...props}>
            <motion.g variants={{ normal: { rotate: 0 }, animate: { rotate: [0, -20, 15, 0], transition: { duration: 1.8 } } }}>
                <path d="M16.75 12h3.632a1 1 0 0 1 .894 1.447l-2.034 4.069a1 1 0 0 1-1.708.134l-2.124-2.97" />
                <path d="M17.106 9.053a1 1 0 0 1 .447 1.341l-3.106 6.211a1 1 0 0 1-1.342.447L3.61 12.3a2.92 2.92 0 0 1-1.3-3.91L3.69 5.6a2.92 2.92 0 0 1 3.92-1.3z" />
                <motion.path d="M7 9h.01" variants={{ normal: { opacity: 1 }, animate: { opacity: [1, 0, 1, 0, 1], transition: { duration: 1.8 } } }} />
            </motion.g>
            <path d="M2 19h3.76a2 2 0 0 0 1.8-1.1L9 15" /><path d="M2 21v-4" />
        </IconWrapper>
    );
};

export const AnimatedLaptopCheck = ({ isHovered, ...props }: AnimatedIconProps) => {
    const controls = useIconAnimation(isHovered);
    return (
        <IconWrapper controls={controls} {...props}>
            <path d="M2 20h20" /><rect height="12" rx="2" width="18" x="3" y="4" />
            <motion.path d="m9 10 2 2 4-4" style={{ transformOrigin: "center" }} variants={{ normal: { pathLength: 1, opacity: 1 }, animate: { pathLength: [0, 1], opacity: [0, 1], transition: { duration: 0.4 } } }} />
        </IconWrapper>
    );
};

export const AnimatedChartSpline = ({ isHovered, ...props }: AnimatedIconProps) => {
    const controls = useIconAnimation(isHovered);
    return (
        <IconWrapper controls={controls} {...props}>
            <path d="M3 3v16a2 2 0 0 0 2 2h16" />
            <motion.path d="M7 16c.5-2 1.5-7 4-7 2 0 2 3 4 3 2.5 0 4.5-5 5-7" variants={{ normal: { pathLength: 1, opacity: 1 }, animate: { pathLength: [0, 1], opacity: [0, 1], transition: { delay: 0.15, duration: 0.3 } } }} />
        </IconWrapper>
    );
};

export const AnimatedArchiveIcon = ({ isHovered, ...props }: AnimatedIconProps) => {
    const controls = useIconAnimation(isHovered);
    return (
        <IconWrapper controls={controls} {...props}>
            <motion.rect height="5" width="20" x="2" y="3" rx="1" variants={{ normal: { y: 0 }, animate: { y: -1.5 } }} transition={{ type: "spring" }} />
            <motion.path variants={{ normal: { d: "M4 8v11a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8" }, animate: { d: "M4 11v9a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V11" } }} />
            <motion.path variants={{ normal: { d: "M10 12h4" }, animate: { d: "M10 15h4" } }} />
        </IconWrapper>
    );
};

export const AnimatedWifi = ({ isHovered, ...props }: AnimatedIconProps) => {
    const controls = useIconAnimation(isHovered);
    const levels = [{ d: "M12 20h.01", delay: 0 }, { d: "M8.5 16.429a5 5 0 0 1 7 0", delay: 0.1 }, { d: "M5 12.859a10 10 0 0 1 14 0", delay: 0.2 }, { d: "M2 8.82a15 15 0 0 1 20 0", delay: 0.3 }];
    return (
        <IconWrapper controls={controls} {...props}>
            {levels.map((l, i) => (
                <motion.path key={i} d={l.d} variants={{ normal: { opacity: 1 }, animate: { opacity: [0, 1], transition: { delay: l.delay, type: "spring" } } }} />
            ))}
        </IconWrapper>
    );
};

export const AnimatedFileStack = ({ isHovered, ...props }: AnimatedIconProps) => {
    const controls = useIconAnimation(isHovered);
    const v1 = { normal: { x: 0, y: 0 }, animate: { x: -4, y: 4 } };
    return (
        <IconWrapper controls={controls} {...props}>
            <motion.path d="M21 7h-3a2 2 0 0 1-2-2V2" variants={v1} /><motion.path d="M21 6v6.5c0 .8-.7 1.5-1.5 1.5h-7c-.8 0-1.5-.7-1.5-1.5v-9c0-.8.7-1.5 1.5-1.5H17Z" variants={v1} />
            <path d="M7 8v8.8c0 .3.2.6.4.8.2.2.5.4.8.4H15" />
            <motion.path d="M3 12v8.8c0 .3.2.6.4.8.2.2.5.4.8.4H11" variants={{ normal: { x: 0, y: 0 }, animate: { x: 4, y: -4 } }} />
        </IconWrapper>
    );
};

export const AnimatedRoute = ({ isHovered, ...props }: AnimatedIconProps) => {
    const controls = useIconAnimation(isHovered);
    const cVar = { normal: { pathLength: 1, opacity: 1 }, animate: { pathLength: [0, 1], opacity: [0, 1], transition: { duration: 0.3, delay: 0.1 } } };
    return (
        <IconWrapper controls={controls} {...props}>
            <motion.circle cx="6" cy="19" r="3" variants={cVar} />
            <motion.path d="M9 19h8.5a3.5 3.5 0 0 0 0-7h-11a3.5 3.5 0 0 1 0-7H15" variants={{ normal: { pathLength: 1, pathOffset: 0 }, animate: { pathLength: [0, 1], pathOffset: [1, 0], transition: { duration: 0.7, delay: 0.5 } } }} />
            <motion.circle cx="18" cy="5" r="3" variants={cVar} />
        </IconWrapper>
    );
};

export const AnimatedSettings = ({ isHovered, ...props }: AnimatedIconProps) => {
    const controls = useIconAnimation(isHovered);
    return (
        <IconWrapper controls={controls} {...props} variants={{ normal: { rotate: 0 }, animate: { rotate: 180, transition: SPRING_TRANS } }}>
            <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" /><circle cx="12" cy="12" r="3" />
        </IconWrapper>
    );
};

export const AnimatedSlidersHorizontal = ({ isHovered, ...props }: AnimatedIconProps) => {
    const controls = useIconAnimation(isHovered);

    const lineVar = (
        n: TargetAndTransition,
        a: TargetAndTransition
    ) => ({
        normal: n,
        animate: a
    });

    return (
        <IconWrapper controls={controls} {...props}>
            <motion.line x1="21" y1="4" y2="4" transition={SLIDER_SPRING} variants={lineVar({ x2: 14 }, { x2: 10 })} />
            <motion.line x2="3" y1="4" y2="4" transition={SLIDER_SPRING} variants={lineVar({ x1: 10 }, { x1: 5 })} />
            <motion.line x1="21" y1="12" y2="12" transition={SLIDER_SPRING} variants={lineVar({ x2: 12 }, { x2: 18 })} />
            <motion.line x2="3" y1="12" y2="12" transition={SLIDER_SPRING} variants={lineVar({ x1: 8 }, { x1: 13 })} />
            <motion.line x1="3" y1="20" y2="20" transition={SLIDER_SPRING} variants={lineVar({ x2: 12 }, { x2: 4 })} />
            <motion.line x2="21" y1="20" y2="20" transition={SLIDER_SPRING} variants={lineVar({ x1: 16 }, { x1: 8 })} />
            <motion.line y1="2" y2="6" transition={SLIDER_SPRING} variants={lineVar({ x1: 14, x2: 14 }, { x1: 9, x2: 9 })} />
            <motion.line y1="10" y2="14" transition={SLIDER_SPRING} variants={lineVar({ x1: 8, x2: 8 }, { x1: 14, x2: 14 })} />
            <motion.line y1="18" y2="22" transition={SLIDER_SPRING} variants={lineVar({ x1: 16, x2: 16 }, { x1: 8, x2: 8 })} />
        </IconWrapper>
    );
};

export const AnimatedFileText = ({ isHovered, size, color, strokeWidth, className, style }: AnimatedIconProps) => {
    const controls = useIconAnimation(isHovered);
    return (
        <IconWrapper controls={controls} size={size} color={color} strokeWidth={strokeWidth} className={className} style={style}>
            <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" />
            <path d="M14 2v4a2 2 0 0 0 2 2h4" />
            <motion.path d="M10 9H8" variants={{ normal: { pathLength: 1 }, animate: { pathLength: [1, 0, 1], transition: { duration: 1.4, repeat: Infinity, ease: "easeInOut", delay: 0 } } }} />
            <motion.path d="M16 13H8" variants={{ normal: { pathLength: 1 }, animate: { pathLength: [1, 0, 1], transition: { duration: 1.4, repeat: Infinity, ease: "easeInOut", delay: 0.2 } } }} />
            <motion.path d="M16 17H8" variants={{ normal: { pathLength: 1 }, animate: { pathLength: [1, 0, 1], transition: { duration: 1.4, repeat: Infinity, ease: "easeInOut", delay: 0.4 } } }} />
        </IconWrapper>
    );
};

export const AnimatedBadgeAlert = ({ isHovered, loop = false, ...props }: AnimatedIconProps & { loop?: boolean }) => {
    const controls = useIconAnimation(isHovered, { loop });

    return (
        <IconWrapper
            controls={controls}
            {...props}
            variants={{
                normal: { scale: 1, rotate: 0 },
                animate: {
                    scale: [1, 1.1, 1.1, 1.1, 1],
                    rotate: [0, -3, 3, -2, 2, 0],
                    transition: {
                        duration: 0.5,
                        times: [0, 0.2, 0.4, 0.6, 1],
                        ease: "easeInOut",
                    },
                },
            }}
        >
            <path d="M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z" />
            <line x1="12" x2="12" y1="8" y2="12" />
            <line x1="12" x2="12.01" y1="16" y2="16" />
        </IconWrapper>
    );
};

export const AnimatedPlus = ({ isHovered, ...props }: AnimatedIconProps) => {
    const controls = useIconAnimation(isHovered);

    return (
        <IconWrapper
            controls={controls}
            {...props}
            variants={{
                normal: {
                    rotate: 0
                },
                animate: {
                    rotate: 180,
                    transition: { type: "spring", stiffness: 100, damping: 15 }
                }
            }}
        >
            <path d="M5 12h14" />
            <path d="M12 5v14" />
        </IconWrapper>
    );
};

export const AnimatedPenTool = ({ isHovered, ...props }: AnimatedIconProps) => {
    const controls = useIconAnimation(isHovered);

    return (
        <IconWrapper
            controls={controls}
            {...props}
            variants={{
                normal: { rotate: 0, y: 0, x: 0 },
                animate: {
                    rotate: [0, 0, 8, -3, 8, 0],
                    y: [0, 2, 0, -1, 0],
                    transition: { duration: 1 }
                }
            }}
        >
            <path d="M15.707 21.293a1 1 0 0 1-1.414 0l-1.586-1.586a1 1 0 0 1 0-1.414l5.586-5.586a1 1 0 0 1 1.414 0l1.586 1.586a1 1 0 0 1 0 1.414z" />
            <path d="m18 13-1.375-6.874a1 1 0 0 0-.746-.776L3.235 2.028a1 1 0 0 0-1.207 1.207L5.35 15.879a1 1 0 0 0 .776.746L13 18" />
            <motion.path
                d="m2.3 2.3 7.286 7.286"
                variants={{
                    normal: { pathLength: 1, opacity: 1, pathOffset: 0 },
                    animate: {
                        pathLength: [0, 0, 1],
                        opacity: [0, 1],
                        pathOffset: [0, 1, 0],
                        transition: { duration: 0.8 }
                    }
                }}
            />
            <circle cx="11" cy="11" r="2" />
        </IconWrapper>
    );
};

export const AnimatedAArrowDown = ({ isHovered, ...props }: AnimatedIconProps) => {
    const controls = useIconAnimation(isHovered);
    const letterVar = { normal: { opacity: 1, scale: 1 }, animate: { opacity: [0, 1], scale: [0.8, 1], transition: { duration: 0.3 } } };
    const arrowVar = { normal: { opacity: 1, y: 0 }, animate: { opacity: [0, 1], y: [-10, 0], transition: { duration: 0.3, delay: 0.2 } } };
    return (
        <IconWrapper controls={controls} {...props}>
            <motion.path d="M3.5 13h6" variants={letterVar} />
            <motion.path d="m2 16 4.5-9 4.5 9" variants={letterVar} />
            <motion.path d="M18 7v9" variants={arrowVar} />
            <motion.path d="m14 12 4 4 4-4" variants={arrowVar} />
        </IconWrapper>
    );
};

export const AnimatedAArrowUp = ({ isHovered, ...props }: AnimatedIconProps) => {
    const controls = useIconAnimation(isHovered);
    const letterVar = { normal: { opacity: 1, scale: 1 }, animate: { opacity: [0, 1], scale: [0.8, 1], transition: { duration: 0.3 } } };
    const arrowVar = { normal: { opacity: 1, y: 0 }, animate: { opacity: [0, 1], y: [10, 0], transition: { duration: 0.3, delay: 0.2 } } };
    return (
        <IconWrapper controls={controls} {...props}>
            <motion.path d="M3.5 13h6" variants={letterVar} />
            <motion.path d="m2 16 4.5-9 4.5 9" variants={letterVar} />
            <motion.path d="M18 16V7" variants={arrowVar} />
            <motion.path d="m14 11 4-4 4 4" variants={arrowVar} />
        </IconWrapper>
    );
};

export const AnimatedAccessibility = ({ isHovered, ...props }: AnimatedIconProps) => {
    const controls = useIconAnimation(isHovered);
    return (
        <IconWrapper controls={controls} {...props}>
            <motion.circle cx="16" cy="4" r="1" variants={{ normal: { y: 0, x: 0 }, animate: { y: [0, 1, -1, 0], x: [0, 1, -1, 0], transition: { duration: 0.8, ease: "easeInOut" } } }} />
            <motion.g variants={{ normal: { rotate: 0 }, animate: { rotate: [0, 5, -5, 0], transition: { duration: 0.8, ease: "easeInOut" } } }}>
                <path d="m18 19 1-7-6 1" />
                <path d="M8,5l5.5,3-2.4,3.5" />
                <motion.path d="M8 5 L5 8" variants={{ normal: { rotate: 0, d: "M8 5 L5 8" }, animate: { rotate: [0, -60, 0], d: ["M8 5 L5 8", "M8 5 L4 9", "M8 5 L5 8"], transition: { duration: 0.4, delay: 0.2, ease: "easeInOut" } } }} style={{ transformOrigin: "top right" }} />
            </motion.g>
            <motion.g variants={{ normal: { rotate: 0 }, animate: { rotate: -360, transition: { duration: 1, delay: 0.4, ease: "easeInOut" } } }}>
                <path d="M4.2,14.5c-.8,2.6.7,5.4,3.3,6.2,1.2.4,2.4.3,3.6-.2" />
                <path d="M13.8,17.5c.8-2.6-.7-5.4-3.3-6.2-1.2-.4-2.4-.3-3.6.2" />
                <path d="M13,13.1c-.5-.7-1.1-1.2-1.9-1.6" />
            </motion.g>
        </IconWrapper>
    );
};

export const AnimatedActivity = ({ isHovered, ...props }: AnimatedIconProps) => {
    const controls = useIconAnimation(isHovered);
    return (
        <IconWrapper controls={controls} {...props}>
            <motion.path d="M22 12h-2.48a2 2 0 0 0-1.93 1.46l-2.35 8.36a.25.25 0 0 1-.48 0L9.24 2.18a.25.25 0 0 0-.48 0l-2.35 8.36A2 2 0 0 1 4.49 12H2" variants={{ normal: { opacity: 1, pathLength: 1, pathOffset: 0, transition: { duration: 0.4 } }, animate: { opacity: [0, 1], pathLength: [0, 1], pathOffset: [1, 0], transition: { duration: 0.6, ease: "linear" } } }} />
        </IconWrapper>
    );
};

export const AnimatedAirVent = ({ isHovered, ...props }: AnimatedIconProps) => {
    const controls = useIconAnimation(isHovered);
    const windVar = (delay: number) => ({ normal: { pathLength: 1, opacity: 1, pathOffset: 0, transition: { duration: 0.3 } }, animate: { pathLength: [0, 1], opacity: [0, 1], pathOffset: [1, 0], transition: { duration: 0.5, delay } } });
    return (
        <IconWrapper controls={controls} {...props}>
            <path d="M6 12H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
            <path d="M6 8h12" />
            <motion.path d="M18.3 17.7a2.5 2.5 0 0 1-3.16 3.83 2.53 2.53 0 0 1-1.14-2V12" variants={windVar(0)} />
            <motion.path d="M6.6 15.6A2 2 0 1 0 10 17v-5" variants={windVar(0.2)} />
        </IconWrapper>
    );
};

export const AnimatedAirplane = ({ isHovered, ...props }: AnimatedIconProps) => {
    const controls = useIconAnimation(isHovered);
    return (
        <IconWrapper controls={controls} {...props} className="overflow-visible">
            <motion.path d="M17.8 19.2L16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z" variants={{ normal: { x: 0, y: 0, scale: 1 }, animate: { x: 3, y: -3, scale: 0.8, transition: { duration: 0.5 } } }} />
            {[{ x1: 5, y1: 15, x2: 1, y2: 19, delay: 0.1 }, { x1: 7, y1: 17, x2: 3, y2: 21, delay: 0.2 }, { x1: 9, y1: 19, x2: 5, y2: 23, delay: 0.3 }].map((l, i) => (
                <motion.line key={i} x1={l.x1} x2={l.x2} y1={l.y1} y2={l.y2} variants={{ normal: { opacity: 0, pathOffset: [0, 1], translateX: -3, translateY: 3 }, animate: { opacity: 1, pathOffset: [1, 2], translateX: [0, 0], translateY: [0, 0], transition: { duration: 0.3, delay: l.delay, times: [0, 0.6, 1] } } }} />
            ))}
        </IconWrapper>
    );
};

export const AnimatedAlignCenter = ({ isHovered, ...props }: AnimatedIconProps) => {
    const controls = useIconAnimation(isHovered);
    return (
        <IconWrapper controls={controls} {...props}>
            <motion.path d="M17 12H7" variants={{ normal: { translateX: 0 }, animate: { translateX: [0, 3, -3, 2, -2, 0], transition: { duration: 1, ease: "linear" } } }} />
            <path d="M19 18H5" />
            <path d="M21 6H3" />
        </IconWrapper>
    );
};

export const AnimatedAlignHorizontal = ({ isHovered, ...props }: AnimatedIconProps) => {
    const controls = useIconAnimation(isHovered);
    const t = { type: "spring", stiffness: 160, damping: 17, mass: 1 } as any;
    return (
        <IconWrapper controls={controls} {...props}>
            <motion.rect x="9" y="7" width="6" height="10" rx="2" variants={{ normal: { scaleX: 1 }, animate: { scaleX: 0.85, transition: t } }} />
            <motion.path d="M4 22V2" variants={{ normal: { translateX: 0, scaleY: 1 }, animate: { translateX: 2, scaleY: 0.9, transition: t } }} />
            <motion.path d="M20 22V2" variants={{ normal: { translateX: 0, scaleY: 1 }, animate: { translateX: -2, scaleY: 0.9, transition: t } }} />
        </IconWrapper>
    );
};

export const AnimatedAlignLeft = ({ isHovered, ...props }: AnimatedIconProps) => {
    const controls = useIconAnimation(isHovered);
    const t = { type: "spring", stiffness: 150, damping: 15, mass: 0.3 } as any;
    return (
        <IconWrapper controls={controls} {...props}>
            <motion.line x1="3" y1="6" y2="6" variants={{ normal: { x2: 21 }, animate: { x2: 21, transition: t } }} />
            <motion.line x1="3" y1="12" y2="12" variants={{ normal: { x2: 15 }, animate: { x2: 19, transition: t } }} />
            <motion.line x1="3" y1="18" y2="18" variants={{ normal: { x2: 17 }, animate: { x2: 12, transition: t } }} />
        </IconWrapper>
    );
};

export const AnimatedAlignRight = ({ isHovered, ...props }: AnimatedIconProps) => {
    const controls = useIconAnimation(isHovered);
    const t = { type: "spring", stiffness: 150, damping: 15, mass: 0.3 } as any;
    return (
        <IconWrapper controls={controls} {...props}>
            <motion.line x2="21" y1="6" y2="6" variants={{ normal: { x1: 3 }, animate: { x1: 3, transition: t } }} />
            <motion.line x2="21" y1="12" y2="12" variants={{ normal: { x1: 9 }, animate: { x1: 5, transition: t } }} />
            <motion.line x2="21" y1="18" y2="18" variants={{ normal: { x1: 7 }, animate: { x1: 12, transition: t } }} />
        </IconWrapper>
    );
};

export const AnimatedAlignVertical = ({ isHovered, ...props }: AnimatedIconProps) => {
    const controls = useIconAnimation(isHovered);
    const t = { type: "spring", stiffness: 160, damping: 17, mass: 1 } as any;
    return (
        <IconWrapper controls={controls} {...props}>
            <motion.rect x="7" y="9" width="10" height="6" rx="2" variants={{ normal: { scaleY: 1 }, animate: { scaleY: 0.8, transition: t } }} />
            <motion.path d="M22 20H2" variants={{ normal: { translateY: 0, scaleX: 1 }, animate: { translateY: -2, scaleX: 0.9, transition: t } }} />
            <motion.path d="M22 4H2" variants={{ normal: { translateY: 0, scaleX: 1 }, animate: { translateY: 2, scaleX: 0.9, transition: t } }} />
        </IconWrapper>
    );
};

export const AnimatedAmbulance = ({ isHovered, ...props }: AnimatedIconProps) => {
    const controls = useIconAnimation(isHovered);

    return (
        <IconWrapper controls={controls} {...props} className="overflow-visible">
            {[{ y: 8, w: 5, x: 0, d: 0 }, { y: 11, w: 7, x: -1, d: 1 }, { y: 14, w: 4, x: 0, d: 2 }].map((l, i) => (
                <motion.line
                    key={i}
                    x1={l.x}
                    y1={l.y}
                    y2={l.y}
                    variants={{
                        normal: { opacity: 0, x: 0, scaleX: 0 },
                        animate: {
                            opacity: [0, 0.7, 0.5, 0],
                            x: [0, -4, -10, -16],
                            scaleX: [0.2, 1, 0.8, 0.3],
                            transition: { duration: 0.5, delay: l.d * 0.08, times: [0, 0.2, 0.6, 1] }
                        }
                    }}
                />
            ))}
            <motion.g variants={{
                normal: { y: 0 },
                animate: { y: [0, -1, 0, -0.5, 0], transition: { duration: 0.4 } }
            }}>
                <path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2" />
                <path d="M19 18h2a1 1 0 0 0 1-1v-3.28a1 1 0 0 0-.684-.948l-1.923-.641a1 1 0 0 1-.578-.502l-1.539-3.076A1 1 0 0 0 16.382 8H14" />
                <path d="M9 18h6" />
                <motion.g variants={{
                    normal: { opacity: 1 },
                    animate: { opacity: [1, 0.3, 1], transition: { duration: 0.6 } }
                }}>
                    <path d="M10 10H6" /><path d="M8 8v4" />
                </motion.g>
            </motion.g>
            {[7, 17].map((cx, i) => (
                <motion.g key={i} variants={{
                    normal: { y: 0 },
                    animate: { y: [0, -1, 0, -0.5, 0], transition: { duration: 0.4 } }
                }}>
                    <motion.circle
                        cx={cx}
                        cy="18"
                        r="2"
                        style={{ transformOrigin: `${cx}px 18px` }}
                        variants={{
                            normal: { rotate: 0 },
                            animate: { rotate: 360, transition: { duration: 0.5, ease: "linear" } }
                        }}
                    />
                </motion.g>
            ))}
        </IconWrapper>
    );
};

export const AnimatedArrowBigDown = ({ isHovered, ...props }: AnimatedIconProps) => {
    const controls = useIconAnimation(isHovered);
    return (
        <IconWrapper controls={controls} {...props}>
            <motion.path d="M15 6v6h4l-7 7-7-7h4V6h6z" variants={{ normal: { translateY: 0 }, animate: { translateY: [0, 3, 0], transition: { duration: 0.4 } } }} />
        </IconWrapper>
    );
};

export const AnimatedArrowBigDownDash = ({ isHovered, ...props }: AnimatedIconProps) => {
    const controls = useIconAnimation(isHovered);
    return (
        <IconWrapper controls={controls} {...props}>
            <motion.path d="M15 5H9" variants={{ normal: { translateY: 0 }, animate: { translateY: [0, 1, 0], transition: { duration: 0.4 } } }} />
            <motion.path d="M15 9v3h4l-7 7-7-7h4V9z" variants={{ normal: { translateY: 0 }, animate: { translateY: [0, 3, 0], transition: { duration: 0.4 } } }} />
        </IconWrapper>
    );
};

export const AnimatedArrowBigLeft = ({ isHovered, ...props }: AnimatedIconProps) => {
    const controls = useIconAnimation(isHovered);
    return (
        <IconWrapper controls={controls} {...props}>
            <motion.path d="M18 15h-6v4l-7-7 7-7v4h6v6z" variants={{ normal: { translateX: 0 }, animate: { translateX: [0, -3, 0], transition: { duration: 0.4 } } }} />
        </IconWrapper>
    );
};

export const AnimatedArrowBigRight = ({ isHovered, ...props }: AnimatedIconProps) => {
    const controls = useIconAnimation(isHovered);
    return (
        <IconWrapper controls={controls} {...props}>
            <motion.path d="M6 9h6V5l7 7-7 7v-4H6V9z" variants={{ normal: { translateX: 0 }, animate: { translateX: [0, 3, 0], transition: { duration: 0.4 } } }} />
        </IconWrapper>
    );
};

export const AnimatedArrowBigRightDash = ({ isHovered, ...props }: AnimatedIconProps) => {
    const controls = useIconAnimation(isHovered);
    return (
        <IconWrapper controls={controls} {...props}>
            <motion.path d="M5 9v6" variants={{ normal: { translateX: 0 }, animate: { translateX: [0, 1, 0], transition: { duration: 0.4 } } }} />
            <motion.path d="M9 9h3V5l7 7-7 7v-4H9V9z" variants={{ normal: { translateX: 0 }, animate: { translateX: [0, 3, 0], transition: { duration: 0.4 } } }} />
        </IconWrapper>
    );
};

export const AnimatedArrowBigUp = ({ isHovered, ...props }: AnimatedIconProps) => {
    const controls = useIconAnimation(isHovered);
    return (
        <IconWrapper controls={controls} {...props}>
            <motion.path d="M9 18v-6H5l7-7 7 7h-4v6H9z" variants={{ normal: { translateY: 0 }, animate: { translateY: [0, -3, 0], transition: { duration: 0.4 } } }} />
        </IconWrapper>
    );
};

export const AnimatedArrowDown = ({ isHovered, ...props }: AnimatedIconProps) => {
    const controls = useIconAnimation(isHovered);
    return (
        <IconWrapper controls={controls} {...props}>
            <motion.path d="m19 12-7 7-7-7" variants={{ normal: { translateY: 0 }, animate: { translateY: [0, -3, 0], transition: { duration: 0.4 } } }} />
            <motion.path d="M12 5v14" variants={{ normal: { d: "M12 5v14" }, animate: { d: ["M12 5v14", "M12 5v9", "M12 5v14"], transition: { duration: 0.4 } } }} />
        </IconWrapper>
    );
};

export const AnimatedArrowDown01 = ({ isHovered, ...props }: AnimatedIconProps) => {
    const controls = useIconAnimation(isHovered);
    const t = { type: "spring", stiffness: 240, damping: 24 } as any;
    return (
        <IconWrapper controls={controls} {...props}>
            <path d="m3 16 4 4 4-4" /><path d="M7 20V4" />
            <motion.rect x="15" y="4" width="4" height="6" ry="2" variants={{ normal: { translateY: 0 }, animate: { translateY: 10, transition: t } }} />
            <motion.g variants={{ normal: { translateY: 0 }, animate: { translateY: -10, transition: t } }}>
                <path d="M17 20v-6h-2" /><path d="M15 20h4" />
            </motion.g>
        </IconWrapper>
    );
};

export const AnimatedArrowDown10 = ({ isHovered, ...props }: AnimatedIconProps) => {
    const controls = useIconAnimation(isHovered);
    const t = { type: "spring", stiffness: 240, damping: 24 } as any;
    return (
        <IconWrapper controls={controls} {...props}>
            <path d="m3 16 4 4 4-4" /><path d="M7 20V4" />
            <motion.g variants={{ normal: { translateY: 0 }, animate: { translateY: 10, transition: t } }}>
                <path d="M17 10V4h-2" /><path d="M15 10h4" />
            </motion.g>
            <motion.rect x="15" y="14" width="4" height="6" ry="2" variants={{ normal: { translateY: 0 }, animate: { translateY: -10, transition: t } }} />
        </IconWrapper>
    );
};

export const AnimatedArrowDownAZ = ({ isHovered, ...props }: AnimatedIconProps) => {
    const controls = useIconAnimation(isHovered);
    const t = { type: "spring", stiffness: 240, damping: 24 } as any;
    return (
        <IconWrapper controls={controls} {...props}>
            <path d="m3 16 4 4 4-4" /><path d="M7 20V4" />
            <motion.g variants={{ normal: { translateY: 0 }, animate: { translateY: 10, transition: t } }}>
                <path d="M20 8h-5" /><path d="M15 10V6.5a2.5 2.5 0 0 1 5 0V10" />
            </motion.g>
            <motion.path d="M15 14h5l-5 6h5" variants={{ normal: { translateY: 0 }, animate: { translateY: -10, transition: t } }} />
        </IconWrapper>
    );
};

export const AnimatedArrowDownLeft = ({ isHovered, ...props }: AnimatedIconProps) => {
    const controls = useIconAnimation(isHovered);
    return (
        <IconWrapper controls={controls} {...props}>
            <motion.path d="M17 17H7V7" variants={{ normal: { translateX: 0, translateY: 0 }, animate: { translateX: [0, 3, 0], translateY: [0, -3, 0], transition: { duration: 0.5 } } }} />
            <motion.path d="M7 17 L12 12" variants={{ normal: { translateX: 0, translateY: 0, scale: 1 }, animate: { translateX: [0, 3, 0], translateY: [0, -3, 0], scale: [1, 0.85, 1], originX: 1, originY: 1, transition: { duration: 0.5 } } }} />
            <path d="M17 7 L12 12" />
        </IconWrapper>
    );
};

export const AnimatedArrowDownRight = ({ isHovered, ...props }: AnimatedIconProps) => {
    const controls = useIconAnimation(isHovered);
    return (
        <IconWrapper controls={controls} {...props}>
            <motion.path d="M7 7 L17 17" variants={{ normal: { translateX: 0, translateY: 0, scale: 1 }, animate: { translateX: [0, -3, 0], translateY: [0, -3, 0], scale: [1, 0.85, 1], originX: 1, originY: 1, transition: { duration: 0.5 } } }} />
            <motion.path d="M17 7v10H7" variants={{ normal: { translateX: 0, translateY: 0 }, animate: { translateX: [0, -3, 0], translateY: [0, -3, 0], transition: { duration: 0.5 } } }} />
            <motion.path d="M17 17 L10 17" variants={{ normal: { translateX: 0, translateY: 0 }, animate: { translateX: [0, -3, 0], translateY: [0, -3, 0], transition: { duration: 0.5 } } }} />
        </IconWrapper>
    );
};

export const AnimatedArrowDownZA = ({ isHovered, ...props }: AnimatedIconProps) => {
    const controls = useIconAnimation(isHovered);
    const t = { type: "spring", stiffness: 240, damping: 24 } as any;
    return (
        <IconWrapper controls={controls} {...props}>
            <path d="m3 16 4 4 4-4" /><path d="M7 20V4" />
            <motion.path d="M15 4h5l-5 6h5" variants={{ normal: { translateY: 0 }, animate: { translateY: 10, transition: t } }} />
            <motion.g variants={{ normal: { translateY: 0 }, animate: { translateY: -10, transition: t } }}>
                <path d="M20 18h-5" /><path d="M15 20v-3.5a2.5 2.5 0 0 1 5 0V20" />
            </motion.g>
        </IconWrapper>
    );
};

export const AnimatedArrowLeft = ({ isHovered, ...props }: AnimatedIconProps) => {
    const controls = useIconAnimation(isHovered);
    return (
        <IconWrapper controls={controls} {...props}>
            <motion.path d="m12 19-7-7 7-7" variants={{ normal: { translateX: 0 }, animate: { translateX: [0, 3, 0], transition: { duration: 0.4 } } }} />
            <motion.path d="M19 12H5" variants={{ normal: { d: "M19 12H5" }, animate: { d: ["M19 12H5", "M19 12H10", "M19 12H5"], transition: { duration: 0.4 } } }} />
        </IconWrapper>
    );
};

export const AnimatedArrowRight = ({ isHovered, ...props }: AnimatedIconProps) => {
    const controls = useIconAnimation(isHovered);
    return (
        <IconWrapper controls={controls} {...props}>
            <motion.path d="M5 12h14" variants={{ normal: { d: "M5 12h14" }, animate: { d: ["M5 12h14", "M5 12h9", "M5 12h14"], transition: { duration: 0.4 } } }} />
            <motion.path d="m12 5 7 7-7 7" variants={{ normal: { translateX: 0 }, animate: { translateX: [0, -3, 0], transition: { duration: 0.4 } } }} />
        </IconWrapper>
    );
};

export const AnimatedArrowUp = ({ isHovered, ...props }: AnimatedIconProps) => {
    const controls = useIconAnimation(isHovered);
    return (
        <IconWrapper controls={controls} {...props}>
            <motion.path d="m5 12 7-7 7 7" variants={{ normal: { translateY: 0 }, animate: { translateY: [0, 3, 0], transition: { duration: 0.4 } } }} />
            <motion.path d="M12 19V5" variants={{ normal: { d: "M12 19V5" }, animate: { d: ["M12 19V5", "M12 19V10", "M12 19V5"], transition: { duration: 0.4 } } }} />
        </IconWrapper>
    );
};

export const AnimatedArrowUpLeft = ({ isHovered, ...props }: AnimatedIconProps) => {
    const controls = useIconAnimation(isHovered);
    return (
        <IconWrapper controls={controls} {...props}>
            <motion.g variants={{ normal: { scale: 1, translateX: 0, translateY: 0 }, animate: { scale: [1, 0.85, 1], translateX: [0, 4, 0], translateY: [0, 4, 0], originX: 0, originY: 0, transition: { duration: 0.5 } } }}>
                <path d="M7 7H17" /><path d="M7 7V17" /><path d="M17 17L7 7" />
            </motion.g>
        </IconWrapper>
    );
};

export const AnimatedArrowUpRight = ({ isHovered, ...props }: AnimatedIconProps) => {
    const controls = useIconAnimation(isHovered);
    return (
        <IconWrapper controls={controls} {...props}>
            <motion.g variants={{ normal: { scale: 1, translateX: 0, translateY: 0 }, animate: { scale: [1, 0.85, 1], translateX: [0, -4, 0], translateY: [0, 4, 0], originX: 1, originY: 0, transition: { duration: 0.5 } } }}>
                <path d="M7 7H17" /><path d="M17 7V17" /><path d="M7 17L17 7" />
            </motion.g>
        </IconWrapper>
    );
};

export const AnimatedAtSign = ({ isHovered, ...props }: AnimatedIconProps) => {
    const controls = useIconAnimation(isHovered);
    return (
        <IconWrapper controls={controls} {...props}>
            <motion.circle cx="12" cy="12" r="4" variants={{ normal: { opacity: 1, pathLength: 1, pathOffset: 0 }, animate: { opacity: [0, 1], pathLength: [0, 1], pathOffset: [1, 0], transition: { duration: 0.3 } } }} />
            <motion.path d="M16 8v5a3 3 0 0 0 6 0v-1a10 10 0 1 0-4 8" variants={{ normal: { opacity: 1, pathLength: 1 }, animate: { opacity: [0, 1], pathLength: [0, 1], transition: { duration: 0.3, delay: 0.3 } } }} />
        </IconWrapper>
    );
};

export const AnimatedAtom = ({ isHovered, ...props }: AnimatedIconProps) => {
    const controls = useIconAnimation(isHovered);
    const pVar = (d: number) => ({ normal: { opacity: 1, pathLength: 1, pathOffset: 0 }, animate: { opacity: [0, 1], pathLength: [0, 1], pathOffset: [1, 0], transition: { duration: 0.4, delay: d } } });
    return (
        <IconWrapper controls={controls} {...props}>
            <motion.circle cx="12" cy="12" r="1" variants={pVar(0)} />
            <motion.path d="M20.2 20.2c2.04-2.03.02-7.36-4.5-11.9-4.54-4.52-9.87-6.54-11.9-4.5-2.04 2.03-.02 7.36 4.5 11.9 4.54 4.52 9.87 6.54 11.9 4.5Z" variants={pVar(0.3)} />
            <motion.path d="M15.7 15.7c4.52-4.54 6.54-9.87 4.5-11.9-2.03-2.04-7.36-.02-11.9 4.5-4.52 4.54-6.54 9.87-4.5 11.9 2.03 2.04 7.36.02 11.9-4.5Z" variants={pVar(0.6)} />
        </IconWrapper>
    );
};

export const AnimatedAttachFile = ({ isHovered, ...props }: AnimatedIconProps) => {
    const controls = useIconAnimation(isHovered);
    return (
        <IconWrapper controls={controls} {...props}>
            <motion.path d="M6 7.90909V16C6 19.3137 8.68629 22 12 22V22C15.3137 22 18 19.3137 18 16V6C18 3.79086 16.2091 2 14 2V2C11.7909 2 10 3.79086 10 6V15.1818C10 16.2864 10.8954 17.1818 12 17.1818V17.1818C13.1046 17.1818 14 16.2864 14 15.1818V8" variants={{ normal: { pathLength: 1, opacity: 1 }, animate: { opacity: [0, 1], pathLength: [0, 1], transition: { duration: 0.4, delay: 0.1 } } }} />
        </IconWrapper>
    );
};

export const AnimatedAudioLines = ({ isHovered, ...props }: AnimatedIconProps) => {
    const controls = useIconAnimation(isHovered);
    return (
        <IconWrapper controls={controls} {...props}>
            <path d="M2 10v3" />
            <motion.path d="M6 6v11" variants={{ normal: { d: "M6 6v11" }, animate: { d: ["M6 6v11", "M6 10v3", "M6 6v11"], transition: { duration: 1.5, repeat: Infinity } } }} />
            <motion.path d="M10 3v18" variants={{ normal: { d: "M10 3v18" }, animate: { d: ["M10 3v18", "M10 9v5", "M10 3v18"], transition: { duration: 1, repeat: Infinity } } }} />
            <motion.path d="M14 8v7" variants={{ normal: { d: "M14 8v7" }, animate: { d: ["M14 8v7", "M14 6v11", "M14 8v7"], transition: { duration: 0.8, repeat: Infinity } } }} />
            <motion.path d="M18 5v13" variants={{ normal: { d: "M18 5v13" }, animate: { d: ["M18 5v13", "M18 7v9", "M18 5v13"], transition: { duration: 1.5, repeat: Infinity } } }} />
            <path d="M22 10v3" />
        </IconWrapper>
    );
};

export const AnimatedBadgePercent = ({ isHovered, ...props }: AnimatedIconProps) => {
    const controls = useIconAnimation(isHovered);
    return (
        <IconWrapper controls={controls} {...props}>
            <motion.path d="M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z" variants={{ normal: { rotate: 0 }, animate: { rotate: 180, transition: { type: "spring", stiffness: 80, damping: 13 } } }} />
            <path d="m15 9-6 6" /><path d="M9 9h.01" /><path d="M15 15h.01" />
        </IconWrapper>
    );
};

export const AnimatedBan = ({ isHovered, ...props }: AnimatedIconProps) => {
    const controls = useIconAnimation(isHovered);
    return (
        <IconWrapper controls={controls} {...props}>
            <motion.circle cx="12" cy="12" r="10" variants={{ normal: { opacity: 1, pathLength: 1 }, animate: { opacity: [0, 1], pathLength: [0, 1], transition: { duration: 0.4 } } }} />
            <motion.path d="m4.9 4.9 14.2 14.2" variants={{ normal: { opacity: 1, pathLength: 1 }, animate: { opacity: [0, 1], pathLength: [0, 1], transition: { duration: 0.4, delay: 0.4 } } }} />
        </IconWrapper>
    );
};

export const AnimatedBattery = ({ isHovered, ...props }: AnimatedIconProps) => {
    const controls = useIconAnimation(isHovered);
    return (
        <IconWrapper controls={controls} {...props}>
            <rect height="12" rx="2" width="16" x="2" y="6" />
            <path d="M22 14v-4" />
            <motion.rect x="4" y="8" height="8" rx="1" fill="currentColor" stroke="none" variants={{ normal: { width: 0, opacity: 0 }, animate: { width: 12, opacity: 1, transition: { duration: 0.4 } } }} />
        </IconWrapper>
    );
};

export const AnimatedBatteryCharging = ({ isHovered, ...props }: AnimatedIconProps) => {
    const controls = useIconAnimation(isHovered);
    return (
        <IconWrapper controls={controls} {...props}>
            <path d="M14.856 6H16a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-2.935" />
            <path d="M22 14v-4" />
            <path d="M5.14 18H4a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h2.936" />
            <motion.path d="m11 7-3 5h4l-3 5" style={{ originX: "50%", originY: "50%" }} variants={{ normal: { scale: 1, opacity: 1 }, animate: { scale: [1, 1.2, 1], opacity: [1, 0.8, 1], transition: { duration: 0.8, repeat: Infinity } } }} />
        </IconWrapper>
    );
};

export const AnimatedBatteryFull = ({ isHovered, ...props }: AnimatedIconProps) => {
    const controls = useIconAnimation(isHovered);
    return (
        <IconWrapper controls={controls} {...props}>
            <rect height="10" rx="2" ry="2" width="16" x="2" y="7" />
            <line x1="22" x2="22" y1="11" y2="13" />
            {[6, 10, 14].map((x, i) => (
                <motion.line key={i} x1={x} x2={x} y1="11" y2="13" variants={{ normal: { opacity: 1 }, animate: { opacity: [1, 0, 1], transition: { duration: 0.6, delay: i * 0.2 } } }} />
            ))}
        </IconWrapper>
    );
};

export const AnimatedBatteryLow = ({ isHovered, ...props }: AnimatedIconProps) => {
    const controls = useIconAnimation(isHovered);
    return (
        <IconWrapper controls={controls} {...props}>
            <rect height="10" rx="2" ry="2" width="16" x="2" y="7" />
            <line x1="22" x2="22" y1="11" y2="13" />
            <motion.line x1="6" x2="6" y1="11" y2="13" variants={{ normal: { opacity: 1 }, animate: { opacity: [1, 0, 1], transition: { duration: 0.6 } } }} />
        </IconWrapper>
    );
};

export const AnimatedBatteryMedium = ({ isHovered, ...props }: AnimatedIconProps) => {
    const controls = useIconAnimation(isHovered);
    return (
        <IconWrapper controls={controls} {...props}>
            <rect height="10" rx="2" ry="2" width="16" x="2" y="7" />
            <line x1="22" x2="22" y1="11" y2="13" />
            {[6, 10].map((x, i) => (
                <motion.line key={i} x1={x} x2={x} y1="11" y2="13" variants={{ normal: { opacity: 1 }, animate: { opacity: [1, 0, 1], transition: { duration: 0.6, delay: i * 0.2 } } }} />
            ))}
        </IconWrapper>
    );
};

export const AnimatedBatteryPlus = ({ isHovered, ...props }: AnimatedIconProps) => {
    const controls = useIconAnimation(isHovered);
    return (
        <IconWrapper controls={controls} {...props}>
            <path d="M12.543 6H16a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-3.605" />
            <path d="M22 14v-4" />
            <path d="M7.606 18H4a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h3.606" />
            <motion.g style={{ originX: "50%", originY: "50%" }} variants={{ normal: { opacity: 1, scale: 1 }, animate: { opacity: [1, 0.5, 1], scale: [1, 0.8, 1.2, 1], transition: { duration: 0.5 } } }}>
                <path d="M10 9v6" />
                <path d="M7 12h6" />
            </motion.g>
        </IconWrapper>
    );
};

export const AnimatedBatteryWarning = ({ isHovered, ...props }: AnimatedIconProps) => {
    const controls = useIconAnimation(isHovered);
    return (
        <IconWrapper controls={controls} {...props}>
            <path d="M14 6h2a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-2" />
            <path d="M22 14v-4" />
            <path d="M6 18H4a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h2" />
            <motion.g style={{ originX: "50%", originY: "50%" }} variants={{ normal: { opacity: 1, scale: 1 }, animate: { opacity: [1, 0.4, 1], scale: [1, 1.1, 1], transition: { duration: 0.8, repeat: Infinity } } }}>
                <path d="M10 17h.01" />
                <path d="M10 7v6" />
            </motion.g>
        </IconWrapper>
    );
};

export const AnimatedBell = ({ isHovered, ...props }: AnimatedIconProps) => {
    const controls = useIconAnimation(isHovered);
    return (
        <IconWrapper controls={controls} {...props}>
            <motion.path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" variants={{ normal: { rotate: 0 }, animate: { rotate: [0, -10, 10, -10, 0], transition: { duration: 0.5 } } }} />
            <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
        </IconWrapper>
    );
};

export const AnimatedBlocks = ({ isHovered, ...props }: AnimatedIconProps) => {
    const controls = useIconAnimation(isHovered);
    return (
        <IconWrapper controls={controls} {...props}>
            <path d="M10 21V8a1 1 0 0 0-1-1H4a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-5a1 1 0 0 0-1-1H3" />
            <motion.path d="M14 3h7v7h-7z" variants={{ normal: { translateX: 0, translateY: 0 }, animate: { translateX: -4, translateY: 4 } }} />
        </IconWrapper>
    );
};

export const AnimatedBookText = ({ isHovered, ...props }: AnimatedIconProps) => {
    const controls = useIconAnimation(isHovered);
    return (
        <IconWrapper controls={controls} {...props}>
            <motion.g variants={{ normal: { scale: 1, rotate: 0, y: 0 }, animate: { scale: [1, 1.04, 1], rotate: [0, -8, 8, -8, 0], y: [0, -2, 0], transition: { duration: 0.6 } } }}>
                <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H19a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1H6.5a1 1 0 0 1 0-5H20" />
                <path d="M8 11h8" /><path d="M8 7h6" />
            </motion.g>
        </IconWrapper>
    );
};

export const AnimatedBookmark = ({ isHovered, ...props }: AnimatedIconProps) => {
    const controls = useIconAnimation(isHovered);
    return (
        <IconWrapper controls={controls} {...props}>
            <motion.path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z" style={{ originY: 0.5, originX: 0.5 }} variants={{ normal: { scaleY: 1, scaleX: 1 }, animate: { scaleY: [1, 1.3, 0.9, 1.05, 1], scaleX: [1, 0.9, 1.1, 0.95, 1], transition: { duration: 0.6 } } }} />
        </IconWrapper>
    );
};

export const AnimatedBookmarkCheck = ({ isHovered, ...props }: AnimatedIconProps) => {
    const controls = useIconAnimation(isHovered);
    return (
        <IconWrapper controls={controls} {...props}>
            <motion.path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2Z" style={{ originX: 0.5, originY: 0.5 }} variants={{ normal: { scaleY: 1, scaleX: 1 }, animate: { scaleY: [1, 1.3, 0.9, 1.05, 1], scaleX: [1, 0.9, 1.1, 0.95, 1], transition: { duration: 0.6, ease: "easeOut" } } }} />
            <motion.path d="m9 10 2 2 4-4" variants={{ normal: { opacity: 1, pathLength: 1 }, animate: { pathLength: [0, 1], opacity: [0, 1], transition: { duration: 0.3, ease: "easeOut" } } }} />
        </IconWrapper>
    );
};

export const AnimatedBookmarkMinus = ({ isHovered, ...props }: AnimatedIconProps) => {
    const controls = useIconAnimation(isHovered);
    return (
        <IconWrapper controls={controls} {...props}>
            <motion.path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z" style={{ originX: 0.5, originY: 0.5 }} variants={{ normal: { scaleY: 1, scaleX: 1 }, animate: { scaleY: [1, 1.3, 0.9, 1.05, 1], scaleX: [1, 0.9, 1.1, 0.95, 1], transition: { duration: 0.6, ease: "easeOut" } } }} />
            <motion.line x1="15" x2="9" y1="10" y2="10" variants={{ normal: { pathLength: 1, opacity: 1 }, animate: { pathLength: [0, 1], opacity: 1, transition: { duration: 0.3, ease: "easeOut" } } }} />
        </IconWrapper>
    );
};

export const AnimatedBookmarkPlus = ({ isHovered, ...props }: AnimatedIconProps) => {
    const controls = useIconAnimation(isHovered);
    const lineVar = (d: number) => ({ normal: { pathLength: 1, opacity: 1 }, animate: { pathLength: [0, 1], opacity: 1, transition: { duration: 0.3, delay: d, ease: "easeOut" } } } as any);
    return (
        <IconWrapper controls={controls} {...props}>
            <motion.path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z" style={{ originX: 0.5, originY: 0.5 }} variants={{ normal: { scaleY: 1, scaleX: 1 }, animate: { scaleY: [1, 1.3, 0.9, 1.05, 1], scaleX: [1, 0.9, 1.1, 0.95, 1], transition: { duration: 0.6, ease: "easeOut" } } } as any} />
            <motion.line x1="12" x2="12" y1="7" y2="13" variants={lineVar(0)} />
            <motion.line x1="15" x2="9" y1="10" y2="10" variants={lineVar(0.1)} />
        </IconWrapper>
    );
};

export const AnimatedBookmarkX = ({ isHovered, ...props }: AnimatedIconProps) => {
    const controls = useIconAnimation(isHovered);
    const lineVar = (d: number) => ({ normal: { pathLength: 1, opacity: 1 }, animate: { pathLength: [0, 1], opacity: 1, transition: { duration: 0.3, delay: d, ease: "easeOut" } } } as any);
    return (
        <IconWrapper controls={controls} {...props}>
            <motion.path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2Z" style={{ originX: 0.5, originY: 0.5 }} variants={{ normal: { scaleY: 1, scaleX: 1 }, animate: { scaleY: [1, 1.3, 0.9, 1.05, 1], scaleX: [1, 0.9, 1.1, 0.95, 1], transition: { duration: 0.6, ease: "easeOut" } } } as any} />
            <motion.path d="m14.5 7.5-5 5" variants={lineVar(0)} />
            <motion.path d="m9.5 7.5 5 5" variants={lineVar(0.1)} />
        </IconWrapper>
    );
};

export const AnimatedBot = ({ isHovered, ...props }: AnimatedIconProps) => {
    const controls = useIconAnimation(isHovered);
    const blinkVar = { normal: { y1: 13, y2: 15 }, animate: { y1: [13, 14, 13], y2: [15, 14, 15], transition: { duration: 0.5, delay: 0.2, ease: "easeInOut" } } } as any;
    return (
        <IconWrapper controls={controls} {...props}>
            <path d="M12 8V4H8" /><rect height="12" rx="2" width="16" x="4" y="8" /><path d="M2 14h2" /><path d="M20 14h2" />
            <motion.line x1={15} x2={15} variants={blinkVar} />
            <motion.line x1={9} x2={9} variants={blinkVar} />
        </IconWrapper>
    );
};

export const AnimatedBox = ({ isHovered, ...props }: AnimatedIconProps) => {
    const controls = useIconAnimation(isHovered);
    const pVar = { normal: { opacity: 1, pathLength: 1 }, animate: { opacity: [0, 1], pathLength: [0, 1], transition: { duration: 0.4 } } };
    return (
        <IconWrapper controls={controls} {...props}>
            <motion.path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" variants={pVar} />
            <motion.path d="m3.3 7 8.7 5 8.7-5" variants={pVar} />
            <motion.path d="M12 22V12" variants={pVar} />
        </IconWrapper>
    );
};

export const AnimatedBoxes = ({ isHovered, ...props }: AnimatedIconProps) => {
    const controls = useIconAnimation(isHovered);
    return (
        <IconWrapper controls={controls} {...props} style={{ overflow: "visible" }}>
            <motion.path d="M2.97 12.92A2 2 0 0 0 2 14.63v3.24a2 2 0 0 0 .97 1.71l3 1.8a2 2 0 0 0 2.06 0L12 19v-5.5l-5-3-4.03 2.42Z m4.03 3.58 -4.74 -2.85 m4.74 2.85 5-3 m-5 3v5.17" variants={{ normal: { translateX: 0, translateY: 0 }, animate: { translateX: -1.5, translateY: 1.5 } }} />
            <motion.path d="M12 13.5V19l3.97 2.38a2 2 0 0 0 2.06 0l3-1.8a2 2 0 0 0 .97-1.71v-3.24a2 2 0 0 0-.97-1.71L17 10.5l-5 3Z m5 3-5-3 m5 3 4.74-2.85 M17 16.5v5.17" variants={{ normal: { translateX: 0, translateY: 0 }, animate: { translateX: 1.5, translateY: 1.5 } }} />
            <motion.path d="M7.97 4.42A2 2 0 0 0 7 6.13v4.37l5 3 5-3V6.13a2 2 0 0 0-.97-1.71l-3-1.8a2 2 0 0 0-2.06 0l-3 1.8Z M12 8 7.26 5.15 m4.74 2.85 4.74-2.85 M12 13.5V8" variants={{ normal: { translateX: 0, translateY: 0 }, animate: { translateX: 0, translateY: -1.5 } }} />
        </IconWrapper>
    );
};

export const AnimatedBrain = ({ isHovered, ...props }: AnimatedIconProps) => {
    const controls = useIconAnimation(isHovered);
    const t = { duration: 1.4, repeat: Infinity, repeatType: "mirror", ease: "easeInOut" } as any;
    return (
        <IconWrapper controls={controls} {...props} variants={{ normal: { scale: 1, strokeWidth: 2 }, animate: { scale: [1, 1.08, 1], strokeWidth: [2, 2.25, 2], transition: t } }}>
            <motion.path d="M12 18V5" variants={{ normal: { pathLength: 1, pathOffset: 0 }, animate: { pathLength: [1, 0.4, 1], pathOffset: [0, 0.25, 0], transition: t } }} />
            <motion.path d="M15 13a4.17 4.17 0 0 1-3-4 4.17 4.17 0 0 1-3 4" variants={{ normal: { pathLength: 1, pathOffset: 0 }, animate: { pathLength: [1, 0.5, 1], pathOffset: [0, 0.25, 0], transition: t } }} />
            <motion.path d="M12 5A3 3 0 1 1 17.598 6.5" variants={{ normal: { pathLength: 1, pathOffset: 0 }, animate: { pathLength: [1, 0.8, 1], pathOffset: [0, 0.07, 0], transition: t } }} />
            <motion.path d="M12 5A3 3 0 1 0 6.402 6.5" variants={{ normal: { pathLength: 1, pathOffset: 0 }, animate: { pathLength: [1, 0.8, 1], pathOffset: [0, 0.07, 0], transition: t } }} />
            <path d="M17.997 5.125a4 4 0 0 1 2.526 5.77" />
            <motion.path d="M18 18a4 4 0 0 0 2-7.464" variants={{ normal: { pathLength: 1, pathOffset: 0 }, animate: { pathLength: [1, 0.8, 1], pathOffset: [0, 0.14, 0], transition: t } }} />
            <path d="M19.967 17.483A4 4 0 1 1 12 18a4 4 0 1 1-7.967-.517" />
            <motion.path d="M6 18a4 4 0 0 1-2-7.464" variants={{ normal: { pathLength: 1, pathOffset: 0 }, animate: { pathLength: [1, 0.8, 1], pathOffset: [0, 0.14, 0], transition: t } }} />
            <path d="M6.003 5.125a4 4 0 0 0-2.526 5.77" />
        </IconWrapper>
    );
};

export const AnimatedCalendarCheck = ({ isHovered, ...props }: AnimatedIconProps) => {
    const controls = useIconAnimation(isHovered);
    return (
        <IconWrapper controls={controls} {...props}>
            <path d="M8 2v4" /><path d="M16 2v4" /><rect height="18" rx="2" width="18" x="3" y="4" /><path d="M3 10h18" />
            <motion.path d="m9 16 2 2 4-4" style={{ transformOrigin: "center" }} variants={{ normal: { pathLength: 1, opacity: 1 }, animate: { pathLength: [0, 1], opacity: [0, 1], transition: { duration: 0.4 } } }} />
        </IconWrapper>
    );
};

export const AnimatedCalendarCheck2 = ({ isHovered, ...props }: AnimatedIconProps) => {
    const controls = useIconAnimation(isHovered);
    return (
        <IconWrapper controls={controls} {...props}>
            <path d="M8 2v4" /><path d="M16 2v4" /><path d="M21 14V6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h8" /><path d="M3 10h18" />
            <motion.path d="m16 20 2 2 4-4" style={{ transformOrigin: "center" }} variants={{ normal: { pathLength: 1, opacity: 1 }, animate: { pathLength: [0, 1], opacity: [0, 1], transition: { duration: 0.4 } } }} />
        </IconWrapper>
    );
};

export const AnimatedCalendarCog = ({ isHovered, ...props }: AnimatedIconProps) => {
    const controls = useIconAnimation(isHovered);
    return (
        <IconWrapper controls={controls} {...props}>
            <path d="M21 10.5V6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h6" />
            <path d="M16 2v4" /><path d="M3 10h18" /><path d="M8 2v4" />
            <motion.g variants={{ normal: { rotate: 0 }, animate: { rotate: 180, transition: { type: "spring", stiffness: 50, damping: 10 } } }} style={{ transformOrigin: "18px 18px" }}>
                <path d="m15.2 16.9-.9-.4" /><path d="m15.2 19.1-.9.4" /><path d="m16.9 15.2-.4-.9" /><path d="m16.9 20.8-.4.9" />
                <path d="m19.5 14.3-.4.9" /><path d="m19.5 21.7-.4-.9" /><path d="m21.7 16.5-.9.4" /><path d="m21.7 19.5-.9-.4" /><circle cx="18" cy="18" r="3" />
            </motion.g>
        </IconWrapper>
    );
};

export const AnimatedCalendarDays = ({ isHovered, ...props }: AnimatedIconProps) => {
    const controls = useIconAnimation(isHovered);
    const DOTS = [{ cx: 8, cy: 14 }, { cx: 12, cy: 14 }, { cx: 16, cy: 14 }, { cx: 8, cy: 18 }, { cx: 12, cy: 18 }, { cx: 16, cy: 18 }];
    return (
        <IconWrapper controls={controls} {...props}>
            <path d="M8 2v4" /><path d="M16 2v4" /><rect height="18" rx="2" width="18" x="3" y="4" /><path d="M3 10h18" />
            {DOTS.map((dot, index) => (
                <motion.circle key={`${dot.cx}-${dot.cy}`} cx={dot.cx} cy={dot.cy} r="1" fill="currentColor" stroke="none" variants={{ normal: { opacity: 1 }, animate: { opacity: [1, 0.3, 1], transition: { delay: index * 0.1, duration: 0.4 } } }} />
            ))}
        </IconWrapper>
    );
};

export const AnimatedCart = ({ isHovered, ...props }: AnimatedIconProps) => {
    const controls = useIconAnimation(isHovered);
    return (
        <IconWrapper controls={controls} {...props} variants={{ normal: { scale: 1 }, animate: { scale: 1.1, y: [0, -5, 0], transition: { duration: 0.3, y: { repeat: 1, delay: 0.1, duration: 0.4 } } } }}>
            <path d="M6.29977 5H21L19 12H7.37671M20 16H8L6 3H3M9 20C9 20.5523 8.55228 21 8 21C7.44772 21 7 20.5523 7 20C7 19.4477 7.44772 19 8 19C8.55228 19 9 19.4477 9 20ZM20 20C20 20.5523 19.5523 21 19 21C18.4477 21 18 20.5523 18 20C18 19.4477 18.4477 19 19 19C19.5523 19 20 19.4477 20 20Z" />
        </IconWrapper>
    );
};

export const AnimatedChartBarDecreasing = ({ isHovered, ...props }: AnimatedIconProps) => {
    const controls = useIconAnimation(isHovered);
    const lineVar = (delay: number) => ({ normal: { pathLength: 1, opacity: 1 }, animate: { pathLength: [0, 1], opacity: [0, 1], transition: { duration: 0.3, delay } } } as any);
    return (
        <IconWrapper controls={controls} {...props}>
            <path d="M3 3v16a2 2 0 0 0 2 2h16" />
            <motion.path d="M7 11h8" variants={lineVar(0.1)} />
            <motion.path d="M7 16h3" variants={lineVar(0.2)} />
            <motion.path d="M7 6h12" variants={lineVar(0)} />
        </IconWrapper>
    );
};

export const AnimatedChartBarIncreasing = ({ isHovered, ...props }: AnimatedIconProps) => {
    const controls = useIconAnimation(isHovered);
    const lineVar = (delay: number) => ({ normal: { pathLength: 1, opacity: 1 }, animate: { pathLength: [0, 1], opacity: [0, 1], transition: { duration: 0.3, delay } } } as any);
    return (
        <IconWrapper controls={controls} {...props}>
            <path d="M3 3v16a2 2 0 0 0 2 2h16" />
            <motion.path d="M7 11h8" variants={lineVar(0.1)} />
            <motion.path d="M7 16h12" variants={lineVar(0.2)} />
            <motion.path d="M7 6h3" variants={lineVar(0)} />
        </IconWrapper>
    );
};

export const AnimatedChartColumnDecreasing = ({ isHovered, ...props }: AnimatedIconProps) => {
    const controls = useIconAnimation(isHovered);
    const lineVar = (delay: number) => ({ normal: { pathLength: 1, opacity: 1 }, animate: { pathLength: [0, 1], opacity: [0, 1], transition: { duration: 0.3, delay } } } as any);
    return (
        <IconWrapper controls={controls} {...props}>
            <motion.path d="M13 17V9" variants={lineVar(0.1)} />
            <motion.path d="M18 17v-3" variants={lineVar(0.2)} />
            <path d="M3 3v16a2 2 0 0 0 2 2h16" />
            <motion.path d="M8 17V5" variants={lineVar(0)} />
        </IconWrapper>
    );
};

export const AnimatedChartColumnIncreasing = ({ isHovered, ...props }: AnimatedIconProps) => {
    const controls = useIconAnimation(isHovered);
    const lineVar = (delay: number) => ({ normal: { pathLength: 1, opacity: 1 }, animate: { pathLength: [0, 1], opacity: [0, 1], transition: { duration: 0.3, delay } } } as any);
    return (
        <IconWrapper controls={controls} {...props}>
            <motion.path d="M13 17V9" variants={lineVar(0.1)} />
            <motion.path d="M18 17V5" variants={lineVar(0.2)} />
            <path d="M3 3v16a2 2 0 0 0 2 2h16" />
            <motion.path d="M8 17v-3" variants={lineVar(0)} />
        </IconWrapper>
    );
};

export const AnimatedChartNoAxesColumnDecreasing = ({ isHovered, ...props }: AnimatedIconProps) => {
    const controls = useIconAnimation(isHovered);
    const lineVar = (delay: number) => ({ normal: { pathLength: 1, opacity: 1 }, animate: { pathLength: [0, 1], opacity: [0, 1], transition: { duration: 0.3, delay } } } as any);
    return (
        <IconWrapper controls={controls} {...props}>
            <motion.path d="M6 20V4" variants={lineVar(0)} />
            <motion.path d="M12 20V10" variants={lineVar(0.1)} />
            <motion.path d="M18 20v-4" variants={lineVar(0.2)} />
        </IconWrapper>
    );
};

export const AnimatedChartNoAxesColumnIncreasing = ({ isHovered, ...props }: AnimatedIconProps) => {
    const controls = useIconAnimation(isHovered);
    const lineVar = (delay: number) => ({ normal: { pathLength: 1, opacity: 1 }, animate: { pathLength: [0, 1], opacity: [0, 1], transition: { duration: 0.3, delay } } } as any);
    return (
        <IconWrapper controls={controls} {...props}>
            <motion.path d="M6 20v-4" variants={lineVar(0)} />
            <motion.path d="M12 20v-10" variants={lineVar(0.1)} />
            <motion.path d="M18 20v-16" variants={lineVar(0.2)} />
        </IconWrapper>
    );
};

export const AnimatedChartLine = ({ isHovered, ...props }: AnimatedIconProps) => {
    const controls = useIconAnimation(isHovered);
    return (
        <IconWrapper controls={controls} {...props}>
            <path d="M3 3v16a2 2 0 0 0 2 2h16" />
            <motion.path d="m7 13 3-3 4 4 5-5" variants={{ normal: { pathLength: 1, opacity: 1 }, animate: { pathLength: [0, 1], opacity: [0, 1], transition: { duration: 0.3, delay: 0.15 } } }} />
        </IconWrapper>
    );
};

export const AnimatedChartPie = ({ isHovered, ...props }: AnimatedIconProps) => {
    const controls = useIconAnimation(isHovered);
    return (
        <IconWrapper controls={controls} {...props}>
            <motion.path d="M21 12c.552 0 1.005-.449.95-.998a10 10 0 0 0-8.953-8.951c-.55-.055-.998.398-.998.95v8a1 1 0 0 0 1 1z" variants={{ normal: { translateX: 0, translateY: 0 }, animate: { translateX: 1.1, translateY: -1.1, transition: { type: "spring", stiffness: 250, damping: 15, bounce: 0.6 } } }} />
            <path d="M21.21 15.89A10 10 0 1 1 8 2.83" />
        </IconWrapper>
    );
};

export const AnimatedChartScatter = ({ isHovered, ...props }: AnimatedIconProps) => {
    const controls = useIconAnimation(isHovered);
    const dotVar = (delay: number) => ({ normal: { opacity: 1 }, animate: { opacity: [0, 1], transition: { duration: 0.3, delay } } } as any);
    return (
        <IconWrapper controls={controls} {...props}>
            <motion.circle cx="7.5" cy="7.5" r=".5" fill="currentColor" variants={dotVar(0)} />
            <motion.circle cx="18.5" cy="5.5" r=".5" fill="currentColor" variants={dotVar(0.15)} />
            <motion.circle cx="11.5" cy="11.5" r=".5" fill="currentColor" variants={dotVar(0.3)} />
            <motion.circle cx="7.5" cy="16.5" r=".5" fill="currentColor" variants={dotVar(0.45)} />
            <motion.circle cx="17.5" cy="14.5" r=".5" fill="currentColor" variants={dotVar(0.6)} />
            <path d="M3 3v16a2 2 0 0 0 2 2h16" strokeWidth="2" />
        </IconWrapper>
    );
};

export const AnimatedCheck = ({ isHovered, ...props }: AnimatedIconProps) => {
    const controls = useIconAnimation(isHovered);
    return (
        <IconWrapper controls={controls} {...props}>
            <motion.path d="M4 12 9 17L20 6" variants={{ normal: { opacity: 1, pathLength: 1, scale: 1 }, animate: { opacity: [0, 1], pathLength: [0, 1], scale: [0.5, 1], transition: { duration: 0.4 } } }} />
        </IconWrapper>
    );
};

export const AnimatedCheckCheck = ({ isHovered, ...props }: AnimatedIconProps) => {
    const controls = useIconAnimation(isHovered);
    const checkVar = (delay: number) => ({ normal: { opacity: 1, pathLength: 1, scale: 1 }, animate: { opacity: [0, 1], pathLength: [0, 1], scale: [0.5, 1], transition: { duration: 0.4, delay } } });
    return (
        <IconWrapper controls={controls} {...props}>
            <motion.path d="M2 12 7 17L18 6" variants={checkVar(0)} />
            <motion.path d="M13 16L14.5 17.5L22 10" variants={checkVar(0.1)} />
        </IconWrapper>
    );
};

export const AnimatedChevronDown = ({ isHovered, ...props }: AnimatedIconProps) => {
    const controls = useIconAnimation(isHovered);
    const t = { times: [0, 0.4, 1], duration: 0.5 } as any;
    return (
        <IconWrapper controls={controls} {...props}>
            <motion.path d="m6 9 6 6 6-6" variants={{ normal: { y: 0 }, animate: { y: [0, 2, 0], transition: t } }} />
        </IconWrapper>
    );
};

export const AnimatedChevronFirst = ({ isHovered, ...props }: AnimatedIconProps) => {
    const controls = useIconAnimation(isHovered);
    return (
        <IconWrapper controls={controls} {...props}>
            <motion.path d="m17 18-6-6 6-6" variants={{ normal: { translateX: 0 }, animate: { translateX: [-2, 1, -1, 0], transition: { duration: 0.6, times: [0, 0.3, 0.7, 1] } } }} />
            <path d="M7 6v12" />
        </IconWrapper>
    );
};

export const AnimatedChevronLeft = ({ isHovered, ...props }: AnimatedIconProps) => {
    const controls = useIconAnimation(isHovered);
    const t = { times: [0, 0.4, 1], duration: 0.5 } as any;
    return (
        <IconWrapper controls={controls} {...props}>
            <motion.path d="m15 18-6-6 6-6" variants={{ normal: { x: 0 }, animate: { x: [0, -2, 0], transition: t } }} />
        </IconWrapper>
    );
};

export const AnimatedChevronRight = ({ isHovered, ...props }: AnimatedIconProps) => {
    const controls = useIconAnimation(isHovered);
    const t = { times: [0, 0.4, 1], duration: 0.5 } as any;
    return (
        <IconWrapper controls={controls} {...props}>
            <motion.path d="m9 18 6-6-6-6" variants={{ normal: { x: 0 }, animate: { x: [0, 2, 0], transition: t } }} />
        </IconWrapper>
    );
};

export const AnimatedChevronUp = ({ isHovered, ...props }: AnimatedIconProps) => {
    const controls = useIconAnimation(isHovered);
    const t = { times: [0, 0.4, 1], duration: 0.5 } as any;
    return (
        <IconWrapper controls={controls} {...props}>
            <motion.path d="m18 15-6-6-6 6" variants={{ normal: { y: 0 }, animate: { y: [0, -2, 0], transition: t } }} />
        </IconWrapper>
    );
};

export const AnimatedChevronsDownUp = ({ isHovered, ...props }: AnimatedIconProps) => {
    const controls = useIconAnimation(isHovered);
    const t = { type: "spring", stiffness: 250, damping: 25 } as any;
    return (
        <IconWrapper controls={controls} {...props}>
            <motion.path d="m7 20 5-5 5 5" variants={{ normal: { translateY: 0 }, animate: { translateY: -2, transition: t } }} />
            <motion.path d="m7 4 5 5 5-5" variants={{ normal: { translateY: 0 }, animate: { translateY: 2, transition: t } }} />
        </IconWrapper>
    );
};

export const AnimatedChevronsLeftRight = ({ isHovered, ...props }: AnimatedIconProps) => {
    const controls = useIconAnimation(isHovered);
    const t = { type: "spring", stiffness: 250, damping: 25 } as any;
    return (
        <IconWrapper controls={controls} {...props}>
            <motion.path d="m9 7-5 5 5 5" variants={{ normal: { translateX: 0 }, animate: { translateX: -2, transition: t } }} />
            <motion.path d="m15 7 5 5-5 5" variants={{ normal: { translateX: 0 }, animate: { translateX: 2, transition: t } }} />
        </IconWrapper>
    );
};

export const AnimatedChevronsRightLeft = ({ isHovered, ...props }: AnimatedIconProps) => {
    const controls = useIconAnimation(isHovered);
    const t = { type: "spring", stiffness: 250, damping: 25 } as any;
    return (
        <IconWrapper controls={controls} {...props}>
            <motion.path d="m20 17-5-5 5-5" variants={{ normal: { translateX: 0 }, animate: { translateX: -2, transition: t } }} />
            <motion.path d="m4 17 5-5-5-5" variants={{ normal: { translateX: 0 }, animate: { translateX: 2, transition: t } }} />
        </IconWrapper>
    );
};

export const AnimatedChevronsUpDown = ({ isHovered, ...props }: AnimatedIconProps) => {
    const controls = useIconAnimation(isHovered);
    const t = { type: "spring", stiffness: 250, damping: 25 } as any;
    return (
        <IconWrapper controls={controls} {...props}>
            <motion.path d="m7 15 5 5 5-5" variants={{ normal: { translateY: 0 }, animate: { translateY: 2, transition: t } }} />
            <motion.path d="m7 9 5-5 5 5" variants={{ normal: { translateY: 0 }, animate: { translateY: -2, transition: t } }} />
        </IconWrapper>
    );
};

export const AnimatedChrome = ({ isHovered, ...props }: AnimatedIconProps) => {
    const controls = useIconAnimation(isHovered);
    const lineVar = (delay: number) => ({ normal: { pathLength: 1, opacity: 1 }, animate: { pathLength: [0, 1], opacity: [0, 1], transition: { duration: 0.3, delay } } });
    return (
        <IconWrapper controls={controls} {...props}>
            <circle cx="12" cy="12" r="10" />
            <motion.circle cx="12" cy="12" r="4" variants={lineVar(0)} />
            <motion.line x1="21.17" x2="12" y1="8" y2="8" variants={lineVar(0.3)} />
            <motion.line x1="3.95" x2="8.54" y1="6.06" y2="14" variants={lineVar(0.3)} />
            <motion.line x1="10.88" x2="15.46" y1="21.94" y2="14" variants={lineVar(0.3)} />
        </IconWrapper>
    );
};

export const AnimatedCircleChevronDown = ({ isHovered, ...props }: AnimatedIconProps) => {
    const controls = useIconAnimation(isHovered);
    return (
        <IconWrapper controls={controls} {...props}>
            <circle cx="12" cy="12" r="10" />
            <motion.path d="m16 10-4 4-4-4" variants={{ normal: { y: 0 }, animate: { y: [0, 2, 0], transition: { duration: 0.5 } } }} />
        </IconWrapper>
    );
};

export const AnimatedCircleChevronLeft = ({ isHovered, ...props }: AnimatedIconProps) => {
    const controls = useIconAnimation(isHovered);
    return (
        <IconWrapper controls={controls} {...props}>
            <circle cx="12" cy="12" r="10" />
            <motion.path d="m14 16-4-4 4-4" variants={{ normal: { x: 0 }, animate: { x: [0, -2, 0], transition: { duration: 0.5 } } }} />
        </IconWrapper>
    );
};

export const AnimatedCircleChevronRight = ({ isHovered, ...props }: AnimatedIconProps) => {
    const controls = useIconAnimation(isHovered);
    return (
        <IconWrapper controls={controls} {...props}>
            <circle cx="12" cy="12" r="10" />
            <motion.path d="m10 8 4 4-4 4" variants={{ normal: { x: 0 }, animate: { x: [0, 2, 0], transition: { duration: 0.5 } } }} />
        </IconWrapper>
    );
};

export const AnimatedCircleChevronUp = ({ isHovered, ...props }: AnimatedIconProps) => {
    const controls = useIconAnimation(isHovered);
    return (
        <IconWrapper controls={controls} {...props}>
            <circle cx="12" cy="12" r="10" />
            <motion.path d="m8 14 4-4 4 4" variants={{ normal: { y: 0 }, animate: { y: [0, -2, 0], transition: { duration: 0.5 } } }} />
        </IconWrapper>
    );
};

export const AnimatedCircleDashed = ({ isHovered, ...props }: AnimatedIconProps) => {
    const controls = useIconAnimation(isHovered);
    const dPaths = ["M10.1 2.182a10 10 0 0 1 3.8 0", "M13.9 21.818a10 10 0 0 1-3.8 0", "M17.609 3.721a10 10 0 0 1 2.69 2.7", "M2.182 13.9a10 10 0 0 1 0-3.8", "M20.279 17.609a10 10 0 0 1-2.7 2.69", "M21.818 10.1a10 10 0 0 1 0 3.8", "M3.721 6.391a10 10 0 0 1 2.7-2.69", "M6.391 20.279a10 10 0 0 1-2.69-2.7"];
    return (
        <IconWrapper controls={controls} {...props}>
            {dPaths.map((d, i) => (
                <motion.path key={d} d={d} variants={{ normal: { opacity: 1 }, animate: { opacity: [0, 1], transition: { delay: (i + 1) * 0.1, duration: 0.3 } } }} />
            ))}
        </IconWrapper>
    );
};

export const AnimatedChessBishop = ({ isHovered, ...props }: AnimatedIconProps) => {
    const controls = useIconAnimation(isHovered);
    const bishopVar = {
        normal: { x: 0, y: 0, rotate: 0, opacity: 1, transition: { type: "spring", stiffness: 220, damping: 18 } },
        animate: {
            x: [0, -6, -6, -6, 6, 6, 6, 0],
            y: [0, -6, -6, -6, 6, 6, 6, 0],
            rotate: [0, -16, -16, -16, 16, 16, 4, 0],
            opacity: [1, 1, 0, 0, 0, 0, 1, 1],
            transition: { duration: 1.4, times: [0, 0.28, 0.38, 0.45, 0.5, 0.58, 0.72, 1], ease: "easeInOut" }
        }
    } as any;

    return (
        <IconWrapper controls={controls} {...props} style={{ overflow: "visible" }}>
            <motion.g style={{ transformBox: "view-box", transformOrigin: "12px 12px" }} variants={bishopVar}>
                <path d="M5 20a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v1a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1z" />
                <path d="M15 18c1.5-.615 3-2.461 3-4.923C18 8.769 14.5 4.462 12 2 9.5 4.462 6 8.77 6 13.077 6 15.539 7.5 17.385 9 18" />
                <path d="m16 7-2.5 2.5" />
                <path d="M9 2h6" />
            </motion.g>
        </IconWrapper>
    );
};

export const AnimatedChessKing = ({ isHovered, ...props }: AnimatedIconProps) => {
    const controls = useIconAnimation(isHovered);
    const kingVar = {
        normal: { rotate: 0, y: 0, transition: { type: "spring", stiffness: 160, damping: 14 } },
        animate: {
            rotate: [0, -10, 10, -6, 6, -2, 0],
            y: [0, -3, -3, -2, -2, -1, 0],
            transition: { duration: 1.1, times: [0, 0.18, 0.38, 0.55, 0.7, 0.85, 1], ease: "easeInOut" }
        }
    } as any;

    return (
        <IconWrapper controls={controls} {...props} style={{ overflow: "visible" }}>
            <motion.g style={{ transformBox: "view-box", transformOrigin: "12px 22px" }} variants={kingVar}>
                <path d="M4 20a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v1a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1z" />
                <path d="m6.7 18-1-1C4.35 15.682 3 14.09 3 12a5 5 0 0 1 4.95-5c1.584 0 2.7.455 4.05 1.818C13.35 7.455 14.466 7 16.05 7A5 5 0 0 1 21 12c0 2.082-1.359 3.673-2.7 5l-1 1" />
                <path d="M10 4h4" />
                <path d="M12 2v6.818" />
            </motion.g>
        </IconWrapper>
    );
};

export const AnimatedChessKnight = ({ isHovered, ...props }: AnimatedIconProps) => {
    const controls = useIconAnimation(isHovered);
    const knightVar = {
        normal: { rotate: 0, y: 0, transition: { type: "spring", stiffness: 220, damping: 12 } },
        animate: {
            rotate: [0, 12, 38, 42, 38, 10, -5, 0],
            y: [0, -2, -9, -12, -9, -2, 1, 0],
            transition: { duration: 0.9, times: [0, 0.1, 0.3, 0.45, 0.6, 0.78, 0.9, 1], ease: "easeInOut" }
        }
    } as any;

    return (
        <IconWrapper controls={controls} {...props} style={{ overflow: "visible" }}>
            <motion.g style={{ transformBox: "view-box", transformOrigin: "12px 22px" }} variants={knightVar}>
                <path d="M5 20a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v1a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1z" />
                <path d="M16.5 18c1-2 2.5-5 2.5-9a7 7 0 0 0-7-7H6.635a1 1 0 0 0-.768 1.64L7 5l-2.32 5.802a2 2 0 0 0 .95 2.526l2.87 1.456" />
                <path d="m15 5 1.425-1.425" />
                <path d="m17 8 1.53-1.53" />
                <path d="M9.713 12.185 7 18" />
            </motion.g>
        </IconWrapper>
    );
};

export const AnimatedChessPawn = ({ isHovered, ...props }: AnimatedIconProps) => {
    const controls = useIconAnimation(isHovered);
    const headVar = {
        normal: { x: 0, y: 0, scale: 1, rotate: 0, transition: { type: "spring", stiffness: 180, damping: 16 } },
        animate: { x: [0, -5, 5, 0], rotate: [0, -15, 15, 0], transition: { duration: 2.4, times: [0, 0.33, 0.66, 1], ease: "easeInOut" } }
    } as any;
    const bodyVar = {
        normal: { rotate: 0, transition: { type: "spring", stiffness: 260, damping: 16 } },
        animate: { rotate: [0, 5, 5, 5, 3, 0], transition: { duration: 1.8, times: [0, 0.08, 0.3, 0.52, 0.72, 1], ease: "easeInOut" } }
    } as any;

    return (
        <IconWrapper controls={controls} {...props}>
            <motion.g style={{ transformBox: "view-box", transformOrigin: "12px 21px" }} variants={bodyVar}>
                <path d="M5 20a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v1a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1z" />
                <path d="m14.5 10 1.5 8" />
                <path d="M7 10h10" />
                <path d="m8 18 1.5-8" />
            </motion.g>
            <motion.circle cx="12" cy="6" r="4" style={{ transformBox: "fill-box", transformOrigin: "center" }} variants={headVar} />
        </IconWrapper>
    );
};

export const AnimatedCircleDollarSign = ({ isHovered, ...props }: AnimatedIconProps) => {
    const controls = useIconAnimation(isHovered);
    return (
        <IconWrapper controls={controls} {...props}>
            <circle cx="12" cy="12" r="10" />
            <motion.path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8" variants={{ normal: { opacity: 1, pathLength: 1, transition: { duration: 0.4 } }, animate: { opacity: [0, 1], pathLength: [0, 1], transition: { duration: 0.6 } } } as any} />
            <motion.path d="M12 18V6" variants={{ normal: { opacity: 1, pathLength: 1, pathOffset: 0, transition: { duration: 0.3, delay: 0.3 } }, animate: { opacity: [0, 1], pathLength: [0, 1], pathOffset: [1, 0], transition: { duration: 0.4, delay: 0.5 } } } as any} />
        </IconWrapper>
    );
};

export const AnimatedClap = ({ isHovered, ...props }: AnimatedIconProps) => {
    const controls = useIconAnimation(isHovered);
    return (
        <IconWrapper controls={controls} {...props} style={{ overflow: "visible" }}>
            <motion.g variants={{ normal: { rotate: 0, originX: "4px", originY: "20px" }, animate: { rotate: [-10, -10, 0], transition: { duration: 0.8, times: [0, 0.5, 1], ease: "easeInOut" } } } as any}>
                <motion.g variants={{ normal: { rotate: 0, originX: "3px", originY: "11px" }, animate: { rotate: [0, -10, 16, 0], transition: { duration: 0.4, times: [0, 0.3, 0.6, 1], ease: "easeInOut" } } } as any}>
                    <path d="M20.2 6 3 11l-.9-2.4c-.3-1.1.3-2.2 1.3-2.5l13.5-4c1.1-.3 2.2.3 2.5 1.3Z" />
                    <path d="m6.2 5.3 3.1 3.9" />
                    <path d="m12.4 3.4 3.1 4" />
                </motion.g>
                <path d="M3 11h18v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2Z" />
            </motion.g>
        </IconWrapper>
    );
};

export const AnimatedClock = ({ isHovered, ...props }: AnimatedIconProps) => {
    const controls = useIconAnimation(isHovered);
    return (
        <IconWrapper controls={controls} {...props}>
            <circle cx="12" cy="12" r="10" />
            <motion.line x1="12" x2="12" y1="12" y2="6" variants={{ normal: { rotate: 0, originX: "0%", originY: "100%" }, animate: { rotate: 360, originX: "0%", originY: "100%", transition: { duration: 0.6, ease: [0.4, 0, 0.2, 1] } } }} />
            <motion.line x1="12" x2="16" y1="12" y2="12" variants={{ normal: { rotate: 0, originX: "0%", originY: "100%" }, animate: { rotate: 45, originX: "0%", originY: "100%", transition: { duration: 0.5, ease: "easeInOut" } } }} />
        </IconWrapper>
    );
};

export const AnimatedCloudDownload = ({ isHovered, ...props }: AnimatedIconProps) => {
    const controls = useIconAnimation(isHovered);
    return (
        <IconWrapper controls={controls} {...props}>
            <path d="M4.2 15.1A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.2" />
            <motion.g variants={{
                normal: { y: 2 },
                animate: { y: 0, transition: { duration: 0.3, ease: [0.68, -0.6, 0.32, 1.6] } }
            }}>
                <path d="M12 13v8l-4-4" />
                <path d="m12 21 4-4" />
            </motion.g>
        </IconWrapper>
    );
};

export const AnimatedCloudLightning = ({ isHovered, ...props }: AnimatedIconProps) => {
    const controls = useIconAnimation(isHovered);
    return (
        <IconWrapper controls={controls} {...props}>
            <path d="M6 16.326A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 .5 8.973" />
            <motion.path d="m13 12-3 5h4l-3 5" variants={{ normal: { opacity: 1 }, animate: { opacity: [1, 0.4, 1], transition: { duration: 1, repeat: Infinity, ease: "easeInOut" } } } as any} />
        </IconWrapper>
    );
};

export const AnimatedCloudRain = ({ isHovered, ...props }: AnimatedIconProps) => {
    const controls = useIconAnimation(isHovered);
    const dropVar = { normal: { opacity: 1 }, animate: { opacity: [1, 0.2, 1], transition: { duration: 1, repeat: Infinity, ease: "easeInOut" } } } as any;
    return (
        <IconWrapper controls={controls} {...props}>
            <path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242" />
            <motion.g variants={{ normal: {}, animate: { transition: { staggerChildren: 0.2 } } }}>
                <motion.path d="M16 14v6" variants={dropVar} />
                <motion.path d="M8 14v6" variants={dropVar} />
                <motion.path d="M12 16v6" variants={dropVar} />
            </motion.g>
        </IconWrapper>
    );
};

export const AnimatedCloudRainWind = ({ isHovered, ...props }: AnimatedIconProps) => {
    const controls = useIconAnimation(isHovered);
    const dropVar = { normal: { opacity: 1 }, animate: { opacity: [1, 0.2, 1], transition: { duration: 1, repeat: Infinity, ease: "easeInOut" } } } as any;
    return (
        <IconWrapper controls={controls} {...props}>
            <path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242" />
            <motion.g variants={{ normal: {}, animate: { transition: { staggerChildren: 0.2 } } }}>
                <motion.path d="m9.2 22 3-7" variants={dropVar} />
                <motion.path d="m9 13-3 7" variants={dropVar} />
                <motion.path d="m17 13-3 7" variants={dropVar} />
            </motion.g>
        </IconWrapper>
    );
};

export const AnimatedCloudSnow = ({ isHovered, ...props }: AnimatedIconProps) => {
    const controls = useIconAnimation(isHovered);
    const snowVar = { normal: { opacity: 1 }, animate: { opacity: [1, 0.3, 1], transition: { duration: 1.5, repeat: Infinity, ease: "easeInOut" } } } as any;
    return (
        <IconWrapper controls={controls} {...props}>
            <path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242" />
            <motion.g variants={{ normal: {}, animate: { transition: { staggerChildren: 0.3 } } }}>
                {["M8 15h.01", "M8 19h.01", "M12 17h.01", "M12 21h.01", "M16 15h.01", "M16 19h.01"].map((d, i) => (
                    <motion.path key={i} d={d} variants={snowVar} />
                ))}
            </motion.g>
        </IconWrapper>
    );
};

export const AnimatedCloudSun = ({ isHovered, ...props }: AnimatedIconProps) => {
    const controls = useIconAnimation(isHovered);
    return (
        <IconWrapper controls={controls} {...props} style={{ overflow: "visible" }}>
            <motion.g variants={{ normal: { x: 0, y: 0 }, animate: { x: [-1, 1, -1, 1, 0], y: [-1, 1, -1, 1, 0], transition: { duration: 1, ease: "easeInOut" } } }}>
                <path d="M13 22H7a5 5 0 1 1 4.9-6H13a3 3 0 0 1 0 6Z" />
            </motion.g>
            {["M12 2v2", "m4.93 4.93 1.41 1.41", "M20 12h2", "m19.07 4.93-1.41 1.41", "M15.947 12.65a4 4 0 0 0-5.925-4.128"].map((d, i) => (
                <motion.path key={d} d={d} variants={{ normal: { opacity: 1 }, animate: { opacity: [0, 1], transition: { duration: 0.3, delay: (i + 1) * 0.1 } } } as any} />
            ))}
        </IconWrapper>
    );
};

export const AnimatedCloudUpload = ({ isHovered, ...props }: AnimatedIconProps) => {
    const controls = useIconAnimation(isHovered);
    return (
        <IconWrapper controls={controls} {...props}>
            <path d="M4.2 15.1A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.2" />
            <motion.g variants={{
                normal: { y: -2 },
                animate: { y: 0, transition: { duration: 0.3, ease: [0.68, -0.6, 0.32, 1.6] } }
            }}>
                <path d="M12 13v8" />
                <path d="m8 17 4-4 4 4" />
            </motion.g>
        </IconWrapper>
    );
};

export const AnimatedCoffee = ({ isHovered, ...props }: AnimatedIconProps) => {
    const controls = useIconAnimation(isHovered);
    const vaporVar = (delay: number) => ({ normal: { y: 0, opacity: 1 }, animate: { y: -3, opacity: [0, 1, 0], transition: { duration: 1.5, repeat: Infinity, ease: "easeInOut", delay } } } as any);
    return (
        <IconWrapper controls={controls} {...props} style={{ overflow: "visible" }}>
            <motion.path d="M10 2v2" variants={vaporVar(0.2)} />
            <motion.path d="M14 2v2" variants={vaporVar(0.4)} />
            <motion.path d="M6 2v2" variants={vaporVar(0)} />
            <path d="M16 8a1 1 0 0 1 1 1v8a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V9a1 1 0 0 1 1-1h14a4 4 0 1 1 0 8h-1" />
        </IconWrapper>
    );
};

export const AnimatedConciergeBell = ({ isHovered, ...props }: AnimatedIconProps) => {
    const controls = useIconAnimation(isHovered);
    return (
        <IconWrapper controls={controls} {...props} style={{ overflow: "visible" }}>
            <path d="M3 20a1 1 0 0 1-1-1v-1a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v1a1 1 0 0 1-1 1Z" />
            <motion.g style={{ originX: "50%", originY: "100%" }} variants={{ normal: { rotate: 0 }, animate: { rotate: [0, -2, 2, -2, 2, -1, 1, 0], transition: { duration: 0.28, delay: 0.1, ease: "easeInOut" } } } as any}>
                <path d="M20 16a8 8 0 1 0-16 0" />
                <motion.g variants={{ normal: { y: 0 }, animate: { y: [0, 2, 0], transition: { duration: 0.2 } } } as any}>
                    <path d="M10 4h4" /><path d="M12 4v4" />
                </motion.g>
            </motion.g>
            <motion.g style={{ originX: "14px", originY: "18px" }} variants={{ normal: { opacity: 0, scale: 1 }, animate: { opacity: [0, 1, 0], scale: [0.8, 1, 1.3], transition: { duration: 0.7, delay: 0.13, ease: "easeOut", times: [0, 0.2, 1] } } } as any}>
                <path d="M2 13a7 7 0 0 1 1-3.5" opacity="0.7" strokeWidth="1.5" />
                <path d="M21 13a7 7 0 0 0-1-3.5" opacity="0.7" strokeWidth="1.5" />
            </motion.g>
        </IconWrapper>
    );
};

export const AnimatedConnect = ({ isHovered, ...props }: AnimatedIconProps) => {
    const controls = useIconAnimation(isHovered);
    const t = { type: "spring", stiffness: 500, damping: 30 } as any;
    return (
        <IconWrapper controls={controls} {...props}>
            <motion.path d="M19 5l3 -3" variants={{ normal: { d: "M19 5l3 -3" }, animate: { d: "M17 7l5 -5" } }} transition={t} />
            <motion.path d="m2 22 3-3" variants={{ normal: { d: "m2 22 3-3" }, animate: { d: "m2 22 6-6" } }} transition={t} />
            <motion.path d="M6.3 20.3a2.4 2.4 0 0 0 3.4 0L12 18l-6-6-2.3 2.3a2.4 2.4 0 0 0 0 3.4Z" variants={{ normal: { x: 0, y: 0 }, animate: { x: 3, y: -3 } }} transition={t} />
            <motion.path d="M7.5 13.5 l2.5 -2.5" variants={{ normal: { d: "M7.5 13.5 l2.5 -2.5" }, animate: { d: "M10.43 10.57 l0.10 -0.10" } }} transition={t} />
            <motion.path d="M10.5 16.5 l2.5 -2.5" variants={{ normal: { d: "M10.5 16.5 l2.5 -2.5" }, animate: { d: "M13.43 13.57 l0.10 -0.10" } }} transition={t} />
            <motion.path d="m12 6 6 6 2.3-2.3a2.4 2.4 0 0 0 0-3.4l-2.6-2.6a2.4 2.4 0 0 0-3.4 0Z" variants={{ normal: { x: 0, y: 0 }, animate: { x: -3, y: 3 } }} transition={t} />
        </IconWrapper>
    );
};

export const AnimatedConstruction = ({ isHovered, ...props }: AnimatedIconProps) => {
    const controls = useIconAnimation(isHovered);
    return (
        <IconWrapper controls={controls} {...props}>
            <defs>
                <motion.pattern
                    id="stripes"
                    width="6"
                    height="14"
                    patternUnits="userSpaceOnUse"
                    variants={{
                        normal: { x: 0 },
                        animate: {
                            x: [0, 18],
                            transition: { duration: 0.6, ease: "easeInOut" }
                        }
                    } as any}
                >
                    <path d="M-4 -2 L14 30" stroke="currentColor" strokeWidth="2" />
                </motion.pattern>
            </defs>
            <rect fill="url(#stripes)" height="8" rx="1" width="20" x="2" y="6" />
            <path d="M17 14v7" /><path d="M7 14v7" /><path d="M17 3v3" /><path d="M7 3v3" />
        </IconWrapper>
    );
};

export const AnimatedContrast = ({ isHovered, ...props }: AnimatedIconProps) => {
    const controls = useIconAnimation(isHovered);
    return (
        <IconWrapper controls={controls} {...props}>
            <circle cx="12" cy="12" r="10" />
            <motion.path d="M12 18a6 6 0 0 0 0-12v12z" variants={{ normal: { rotate: 0 }, animate: { rotate: 180, transformOrigin: "left center", transition: { type: "spring", stiffness: 80, damping: 12 } } } as any} />
        </IconWrapper>
    );
};

export const AnimatedCookingPot = ({ isHovered, ...props }: AnimatedIconProps) => {
    const controls = useIconAnimation(isHovered);
    return (
        <IconWrapper controls={controls} {...props}>
            <motion.g style={{ transformOrigin: "12px 16px" }} variants={{ normal: { scale: 1 }, animate: { scale: [1, 1.08, 1], transition: { duration: 0.95, ease: "easeInOut" } } }}>
                <path d="M2 12h20" /><path d="M20 12v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-8" />
            </motion.g>
            <motion.g style={{ transformOrigin: "18px 6px" }} variants={{ normal: { rotate: 0 }, animate: { rotate: [0, -14, 14, -10, 10, -6, 6, 0], transition: { duration: 0.9, ease: "easeInOut" } } }}>
                <path d="m4 8 16-4" />
                <path d="m8.86 6.78-.45-1.81a2 2 0 0 1 1.45-2.43l1.94-.48a2 2 0 0 1 2.43 1.46l.45 1.8" />
            </motion.g>
        </IconWrapper>
    );
};

export const AnimatedCopy = ({ isHovered, ...props }: AnimatedIconProps) => {
    const controls = useIconAnimation(isHovered);
    const t = { type: "spring", stiffness: 160, damping: 17, mass: 1 } as any;
    return (
        <IconWrapper controls={controls} {...props}>
            <motion.rect x="8" y="8" width="14" height="14" rx="2" ry="2" variants={{ normal: { translateY: 0, translateX: 0 }, animate: { translateY: -3, translateX: -3, transition: t } }} />
            <motion.path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" variants={{ normal: { x: 0, y: 0 }, animate: { x: 3, y: 3, transition: t } }} />
        </IconWrapper>
    );
};

export const AnimatedCornerDownLeft = ({ isHovered, ...props }: AnimatedIconProps) => {
    const controls = useIconAnimation(isHovered);
    return (
        <IconWrapper controls={controls} {...props}>
            <motion.g variants={{ normal: { scaleX: 1, x: 0 }, animate: { scaleX: [1, 1.15, 1], x: [0, -2, 0], transition: { duration: 0.45, ease: "easeInOut" } } }}>
                <path d="M4 15h12a4 4 0 0 0 4-4V4" /><path d="m9 20-5-5 5-5" />
            </motion.g>
        </IconWrapper>
    );
};

export const AnimatedCornerDownRight = ({ isHovered, ...props }: AnimatedIconProps) => {
    const controls = useIconAnimation(isHovered);
    return (
        <IconWrapper controls={controls} {...props}>
            <motion.g variants={{ normal: { scaleX: 1, x: 0 }, animate: { scaleX: [1, 1.15, 1], x: [0, 2, 0], transition: { duration: 0.45, ease: "easeInOut" } } }}>
                <path d="m15 10 5 5-5 5" /><path d="M4 4v7a4 4 0 0 0 4 4h12" />
            </motion.g>
        </IconWrapper>
    );
};

export const AnimatedCornerLeftDown = ({ isHovered, ...props }: AnimatedIconProps) => {
    const controls = useIconAnimation(isHovered);
    return (
        <IconWrapper controls={controls} {...props}>
            <motion.g variants={{ normal: { scaleY: 1, y: 0 }, animate: { scaleY: [1, 1.15, 1], y: [0, 2, 0], transition: { duration: 0.45, ease: "easeInOut" } } }}>
                <path d="m14 15-5 5-5-5" /><path d="M20 4h-7a4 4 0 0 0-4 4v12" />
            </motion.g>
        </IconWrapper>
    );
};

export const AnimatedCornerLeftUp = ({ isHovered, ...props }: AnimatedIconProps) => {
    const controls = useIconAnimation(isHovered);
    return (
        <IconWrapper controls={controls} {...props}>
            <motion.g variants={{ normal: { scaleY: 1, y: 0 }, animate: { scaleY: [1, 1.15, 1], y: [0, -2, 0], transition: { duration: 0.45, ease: "easeInOut" } } }}>
                <path d="M14 9 9 4 4 9" /><path d="M20 20h-7a4 4 0 0 1-4-4V4" />
            </motion.g>
        </IconWrapper>
    );
};

export const AnimatedCornerRightDown = ({ isHovered, ...props }: AnimatedIconProps) => {
    const controls = useIconAnimation(isHovered);
    return (
        <IconWrapper controls={controls} {...props}>
            <motion.g variants={{ normal: { scaleY: 1, y: 0 }, animate: { scaleY: [1, 1.15, 1], y: [0, 2, 0], transition: { duration: 0.45, ease: "easeInOut" } } }}>
                <path d="m10 15 5 5 5-5" /><path d="M4 4h7a4 4 0 0 1 4 4v12" />
            </motion.g>
        </IconWrapper>
    );
};

export const AnimatedCornerRightUp = ({ isHovered, ...props }: AnimatedIconProps) => {
    const controls = useIconAnimation(isHovered);
    return (
        <IconWrapper controls={controls} {...props}>
            <motion.g variants={{ normal: { scaleX: 1, x: 0 }, animate: { scaleX: [1, 1.15, 1], x: [0, -2, 0], transition: { duration: 0.45, ease: "easeInOut" } } }}>
                <path d="m10 9 5-5 5 5" /><path d="M4 20h7a4 4 0 0 0 4-4V4" />
            </motion.g>
        </IconWrapper>
    );
};

export const AnimatedCornerUpLeft = ({ isHovered, ...props }: AnimatedIconProps) => {
    const controls = useIconAnimation(isHovered);
    return (
        <IconWrapper controls={controls} {...props}>
            <motion.g variants={{ normal: { scaleX: 1, x: 0 }, animate: { scaleX: [1, 1.15, 1], x: [0, -2, 0], transition: { duration: 0.45, ease: "easeInOut" } } }}>
                <path d="M20 20v-7a4 4 0 0 0-4-4H4" /><path d="M9 14 4 9l5-5" />
            </motion.g>
        </IconWrapper>
    );
};

export const AnimatedCornerUpRight = ({ isHovered, ...props }: AnimatedIconProps) => {
    const controls = useIconAnimation(isHovered);
    return (
        <IconWrapper controls={controls} {...props}>
            <motion.g variants={{ normal: { scaleX: 1, x: 0 }, animate: { scaleX: [1, 1.15, 1], x: [0, 2, 0], transition: { duration: 0.45, ease: "easeInOut" } } }}>
                <path d="m15 14 5-5-5-5" /><path d="M4 20v-7a4 4 0 0 1 4-4h12" />
            </motion.g>
        </IconWrapper>
    );
};

export const AnimatedCpu = ({ isHovered, ...props }: AnimatedIconProps) => {
    const controls = useIconAnimation(isHovered);
    const yVar = { normal: { scaleY: 1 }, animate: { scaleY: [1, 1.5, 1], transition: { duration: 0.5, ease: "easeInOut" } } } as any;
    const xVar = { normal: { scaleX: 1 }, animate: { scaleX: [1, 1.5, 1], transition: { duration: 0.5, ease: "easeInOut" } } } as any;
    return (
        <IconWrapper controls={controls} {...props}>
            <rect height="16" rx="2" width="16" x="4" y="4" />
            <rect height="6" rx="1" width="6" x="9" y="9" />
            <motion.path d="M15 2v2" variants={yVar} />
            <motion.path d="M15 20v2" variants={yVar} />
            <motion.path d="M2 15h2" variants={xVar} />
            <motion.path d="M2 9h2" variants={xVar} />
            <motion.path d="M20 15h2" variants={xVar} />
            <motion.path d="M20 9h2" variants={xVar} />
            <motion.path d="M9 2v2" variants={yVar} />
            <motion.path d="M9 20v2" variants={yVar} />
        </IconWrapper>
    );
};

export const AnimatedCursorClick = ({ isHovered, ...props }: AnimatedIconProps) => {
    const controls = useIconAnimation(isHovered);
    const lineVar = (custom: { x: number, y: number }) => ({
        normal: { opacity: 1, x: 0, y: 0 },
        animate: { opacity: [0, 1, 0, 0, 0, 0, 1], x: [0, custom.x, 0, 0], y: [0, custom.y, 0, 0], transition: { type: "spring", stiffness: 70, damping: 10, mass: 0.4, delay: 0.5 } }
    } as any);

    return (
        <IconWrapper controls={controls} {...props}>
            <motion.path d="M9.037 9.69a.498.498 0 0 1 .653-.653l11 4.5a.5.5 0 0 1-.074.949l-4.349 1.041a1 1 0 0 0-.74.739l-1.04 4.35a.5.5 0 0 1-.95.074z" variants={{ normal: { x: 0, y: 0 }, animate: { x: [0, 0, -3, 0], y: [0, -4, 0, 0], transition: { duration: 1, bounce: 0.3 } } } as any} />
            <motion.path d="M14 4.1 12 6" variants={lineVar({ x: 1, y: -1 })} />
            <motion.path d="m5.1 8-2.9-.8" variants={lineVar({ x: -1, y: 0 })} />
            <motion.path d="m6 12-1.9 2" variants={lineVar({ x: -1, y: 1 })} />
            <motion.path d="M7.2 2.2 8 5.1" variants={lineVar({ x: 0, y: -1 })} />
        </IconWrapper>
    );
};

export const AnimatedDatabaseBackup = ({ isHovered, ...props }: AnimatedIconProps) => {
    const controls = useIconAnimation(isHovered);
    return (
        <IconWrapper controls={controls} {...props}>
            <ellipse cx="12" cy="5" rx="9" ry="3" />
            <path d="M3 12a9 3 0 0 0 5 2.69" />
            <path d="M21 9.3V5" />
            <path d="M3 5v14a9 3 0 0 0 6.47 2.88" />
            <motion.g style={{ transformOrigin: "17.5px 17px" }} variants={{ normal: { rotate: 0 }, animate: { rotate: 360, transition: { duration: 0.6, ease: "easeInOut" } } } as any}>
                <path d="M12 12v4h4" />
                <path d="M13 20a5 5 0 0 0 9-3 4.5 4.5 0 0 0-4.5-4.5c-1.33 0-2.54.54-3.41 1.41L12 16" />
            </motion.g>
        </IconWrapper>
    );
};

export const AnimatedDelete = ({ isHovered, ...props }: AnimatedIconProps) => {
    const controls = useIconAnimation(isHovered);
    const t = { type: "spring", stiffness: 500, damping: 30 } as any;
    return (
        <IconWrapper controls={controls} {...props}>
            <motion.g variants={{ normal: { y: 0 }, animate: { y: -1.1, transition: t } }}>
                <path d="M3 6h18" />
                <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
            </motion.g>
            <motion.path d="M19 8v12c0 1-1 2-2 2H7c-1 0-2-1-2-2V8" variants={{ normal: { d: "M19 8v12c0 1-1 2-2 2H7c-1 0-2-1-2-2V8" }, animate: { d: "M19 9v12c0 1-1 2-2 2H7c-1 0-2-1-2-2V9", transition: t } }} />
            <motion.line x1="10" x2="10" y1="11" y2="17" variants={{ normal: { y1: 11, y2: 17 }, animate: { y1: 11.5, y2: 17.5, transition: t } }} />
            <motion.line x1="14" x2="14" y1="11" y2="17" variants={{ normal: { y1: 11, y2: 17 }, animate: { y1: 11.5, y2: 17.5, transition: t } }} />
        </IconWrapper>
    );
};

export const AnimatedDisc3 = ({ isHovered, ...props }: AnimatedIconProps) => {
    const controls = useIconAnimation(isHovered);
    return (
        <IconWrapper controls={controls} {...props}>
            <circle cx="12" cy="12" r="10" />
            <circle cx="12" cy="12" r="2" />
            <motion.g style={{ transformOrigin: "12px 12px" }} variants={{ normal: { rotate: 0 }, animate: { rotate: 90, transition: { duration: 0.4, ease: "easeInOut" } } } as any}>
                <path d="M6 12c0-1.7.7-3.2 1.8-4.2" />
                <path d="M18 12c0 1.7-.7 3.2-1.8 4.2" />
            </motion.g>
        </IconWrapper>
    );
};

export const AnimatedDollarSign = ({ isHovered, ...props }: AnimatedIconProps) => {
    const controls = useIconAnimation(isHovered);
    return (
        <IconWrapper controls={controls} {...props}>
            <motion.path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" variants={{ normal: { opacity: 1, pathLength: 1 }, animate: { opacity: [0, 1], pathLength: [0, 1], transition: { duration: 0.6 } } } as any} />
            <motion.path d="M12 22 L12 2" variants={{ normal: { opacity: 1, pathLength: 1, pathOffset: 0 }, animate: { opacity: [0, 1], pathLength: [0, 1], pathOffset: [1, 0], transition: { delay: 0.5, duration: 0.4 } } } as any} />
        </IconWrapper>
    );
};

export const AnimatedDownload = ({ isHovered, ...props }: AnimatedIconProps) => {
    const controls = useIconAnimation(isHovered);
    return (
        <IconWrapper controls={controls} {...props}>
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <motion.g variants={{ normal: { y: 0 }, animate: { y: 2, transition: { type: "spring", stiffness: 200, damping: 10, mass: 1 } } } as any}>
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" x2="12" y1="15" y2="3" />
            </motion.g>
        </IconWrapper>
    );
};

export const AnimatedDownvote = ({ isHovered, ...props }: AnimatedIconProps) => {
    const controls = useIconAnimation(isHovered);
    return (
        <IconWrapper controls={controls} {...props}>
            <motion.g variants={{ normal: { translateX: "0px", translateY: "0px", rotate: "0deg" }, animate: { translateX: "-1px", translateY: "2px", rotate: "-12deg", transition: { type: "spring", stiffness: 250, damping: 25 } } } as any}>
                <path d="M17 14V2" />
                <path d="M9 18.12 10 14H4.17a2 2 0 0 1-1.92-2.56l2.33-8A2 2 0 0 1 6.5 2H20a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-2.76a2 2 0 0 0-1.79 1.11L12 22a3.13 3.13 0 0 1-3-3.88Z" />
            </motion.g>
        </IconWrapper>
    );
};

export const AnimatedDroplet = ({ isHovered, ...props }: AnimatedIconProps) => {
    const controls = useIconAnimation(isHovered);
    return (
        <IconWrapper controls={controls} {...props}>
            <motion.path d="M12 22a7 7 0 0 0 7-7c0-2-1-3.9-3-5.5s-3.5-4-4-6.5c-.5 2.5-2 4.9-4 6.5C6 11.1 5 13 5 15a7 7 0 0 0 7 7z" variants={{ normal: { pathLength: 1, opacity: 1, pathOffset: 0 }, animate: { pathLength: [0, 1], opacity: [0, 1], pathOffset: [1, 0], transition: { duration: 0.6, delay: 0.2 } } } as any} />
        </IconWrapper>
    );
};

export const AnimatedEarth = ({ isHovered, ...props }: AnimatedIconProps) => {
    const controls = useIconAnimation(isHovered);
    const lineVar = { normal: { pathLength: 1, opacity: 1, pathOffset: 0 }, animate: { pathLength: [0, 1], opacity: [0, 1], pathOffset: [1, 0], transition: { duration: 0.7, delay: 0.5 } } } as any;
    return (
        <IconWrapper controls={controls} {...props}>
            <motion.path d="M21.54 15H17a2 2 0 0 0-2 2v4.54" variants={lineVar} />
            <motion.path d="M7 3.34V5a3 3 0 0 0 3 3a2 2 0 0 1 2 2c0 1.1.9 2 2 2a2 2 0 0 0 2-2c0-1.1.9-2 2-2h3.17" variants={lineVar} />
            <motion.path d="M11 21.95V18a2 2 0 0 0-2-2a2 2 0 0 1-2-2v-1a2 2 0 0 0-2-2H2.05" variants={lineVar} />
            <motion.circle cx="12" cy="12" r="10" variants={{ normal: { pathLength: 1, opacity: 1 }, animate: { pathLength: [0, 1], opacity: [0, 1], transition: { duration: 0.3, delay: 0.1 } } } as any} />
        </IconWrapper>
    );
};

export const AnimatedEuro = ({ isHovered, ...props }: AnimatedIconProps) => {
    const controls = useIconAnimation(isHovered);
    return (
        <IconWrapper controls={controls} {...props}>
            <motion.path d="M19 6a7.7 7.7 0 0 0-5.2-2A7.9 7.9 0 0 0 6 12c0 4.4 3.5 8 7.8 8 2 0 3.8-.8 5.2-2" variants={{ normal: { opacity: 1, pathLength: 1 }, animate: { opacity: [0, 1], pathLength: [0, 1], transition: { duration: 0.6 } } } as any} />
            <motion.path d="M16 10h-12" variants={{ normal: { opacity: 1, pathLength: 1, pathOffset: 0 }, animate: { opacity: [0, 1], pathLength: [0, 1], pathOffset: [1, 0], transition: { delay: 0.5, duration: 0.4 } } } as any} />
            <motion.path d="M13 14h-9" variants={{ normal: { opacity: 1, pathLength: 1, pathOffset: 0 }, animate: { opacity: [0, 1], pathLength: [0, 1], pathOffset: [1, 0], transition: { delay: 0.5, duration: 0.4 } } } as any} />
        </IconWrapper>
    );
};

export const AnimatedEvCharger = ({ isHovered, ...props }: AnimatedIconProps) => {
    const controls = useIconAnimation(isHovered);
    return (
        <IconWrapper controls={controls} {...props}>
            <path d="M14 13h2a2 2 0 0 1 2 2v2a2 2 0 0 0 4 0v-6.998a2 2 0 0 0-.59-1.42L18 5" />
            <path d="M14 21V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v16" />
            <path d="M2 21h13" /><path d="M3 7h11" />
            <motion.path d="m9 11-2 3h3l-2 3" variants={{ normal: { opacity: 1 }, animate: { opacity: [1, 0.4, 1], transition: { duration: 1, repeat: Infinity, ease: "easeInOut" } } } as any} />
        </IconWrapper>
    );
};

export const AnimatedExpand = ({ isHovered, ...props }: AnimatedIconProps) => {
    const controls = useIconAnimation(isHovered);
    const t = { type: "spring", stiffness: 250, damping: 25 } as any;
    return (
        <IconWrapper controls={controls} {...props}>
            <motion.path d="m21 21-6-6m6 6v-4.8m0 4.8h-4.8" variants={{ normal: { translateX: "0%", translateY: "0%" }, animate: { translateX: "2px", translateY: "2px", transition: t } }} />
            <motion.path d="M3 16.2V21m0 0h4.8M3 21l6-6" variants={{ normal: { translateX: "0%", translateY: "0%" }, animate: { translateX: "-2px", translateY: "2px", transition: t } }} />
            <motion.path d="M21 7.8V3m0 0h-4.8M21 3l-6 6" variants={{ normal: { translateX: "0%", translateY: "0%" }, animate: { translateX: "2px", translateY: "-2px", transition: t } }} />
            <motion.path d="M3 7.8V3m0 0h4.8M3 3l6 6" variants={{ normal: { translateX: "0%", translateY: "0%" }, animate: { translateX: "-2px", translateY: "-2px", transition: t } }} />
        </IconWrapper>
    );
};

export const AnimatedFileChartLine = ({ isHovered, ...props }: AnimatedIconProps) => {
    const controls = useIconAnimation(isHovered);
    return (
        <IconWrapper controls={controls} {...props}>
            <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" />
            <path d="M14 2v4a2 2 0 0 0 2 2h4" />
            <motion.path d="m8 17 2.5-2.5 2 2L16 13" variants={{ normal: { pathLength: 1, opacity: 1 }, animate: { pathLength: [0, 1], opacity: [0, 1], transition: { delay: 0.15, duration: 0.3 } } } as any} />
        </IconWrapper>
    );
};

export const AnimatedFingerprint = ({ isHovered, ...props }: AnimatedIconProps) => {
    const controls = useIconAnimation(isHovered);
    const fpVar = { normal: { pathLength: 1, opacity: 1 }, animate: { opacity: [0, 0, 1, 1, 1], pathLength: [0.1, 0.3, 0.5, 0.7, 0.9, 1], transition: { duration: 2 } } } as any;
    return (
        <IconWrapper controls={controls} {...props}>
            <path d="M12 10a2 2 0 0 0-2 2c0 1.02-.1 2.51-.26 4" fill="none" strokeOpacity={0.4} strokeWidth="2" />
            <motion.path d="M12 10a2 2 0 0 0-2 2c0 1.02-.1 2.51-.26 4" variants={fpVar} />
            <path d="M14 13.12c0 2.38 0 6.38-1 8.88" fill="none" strokeOpacity={0.4} strokeWidth="2" />
            <motion.path d="M14 13.12c0 2.38 0 6.38-1 8.88" variants={fpVar} />
            <path d="M17.29 21.02c.12-.6.43-2.3.5-3.02" fill="none" strokeOpacity={0.4} strokeWidth="2" />
            <motion.path d="M17.29 21.02c.12-.6.43-2.3.5-3.02" variants={fpVar} />
            <path d="M2 12a10 10 0 0 1 18-6" fill="none" strokeOpacity={0.4} strokeWidth="2" />
            <motion.path d="M2 12a10 10 0 0 1 18-6" variants={fpVar} />
            <path d="M2 16h.01" fill="none" strokeOpacity={0.4} strokeWidth="2" />
            <motion.path d="M2 16h.01" variants={fpVar} />
            <path d="M21.8 16c.2-2 .131-5.354 0-6" fill="none" strokeOpacity={0.4} strokeWidth="2" />
            <motion.path d="M21.8 16c.2-2 .131-5.354 0-6" variants={fpVar} />
            <path d="M5 19.5C5.5 18 6 15 6 12a6 6 0 0 1 .34-2" fill="none" strokeOpacity={0.4} strokeWidth="2" />
            <motion.path d="M5 19.5C5.5 18 6 15 6 12a6 6 0 0 1 .34-2" variants={fpVar} />
            <path d="M8.65 22c.21-.66.45-1.32.57-2" fill="none" strokeOpacity={0.4} strokeWidth="2" />
            <motion.path d="M8.65 22c.21-.66.45-1.32.57-2" variants={fpVar} />
            <path d="M9 6.8a6 6 0 0 1 9 5.2v2" fill="none" strokeOpacity={0.4} strokeWidth="2" />
            <motion.path d="M9 6.8a6 6 0 0 1 9 5.2v2" variants={fpVar} />
        </IconWrapper>
    );
};

export const AnimatedFlame = ({ isHovered, ...props }: AnimatedIconProps) => {
    const controls = useIconAnimation(isHovered);
    return (
        <IconWrapper controls={controls} {...props}>
            <motion.path d="M8.9 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z" variants={{ normal: { pathLength: 1, opacity: 1, pathOffset: 0 }, animate: { opacity: [0, 1], pathLength: [0, 1], transition: { duration: 0.4, delay: 0.1 } } } as any} />
        </IconWrapper>
    );
};

export const AnimatedCloudSync = ({ isHovered, ...props }: AnimatedIconProps) => {
    const controls = useAnimation();

    useEffect(() => {
        const sequence = async () => {
            if (isHovered) {
                await controls.start("hidden");
                await controls.start("drawCloud");
                controls.start("spinArrows");
            } else {
                controls.start("normal");
            }
        };
        sequence();
    }, [isHovered, controls]);

    return (
        <IconWrapper controls={controls} {...props}>
            <motion.path
                d="M20.996 15.251A4.5 4.5 0 0 0 17.495 8h-1.79a7 7 0 1 0-12.709 5.607"
                variants={{
                    normal: { pathLength: 1, opacity: 1, transition: { duration: 0.3 } },
                    hidden: { pathLength: 0, opacity: 1, transition: { duration: 0 } },
                    drawCloud: { pathLength: [0, 1], transition: { duration: 0.8, ease: "easeInOut" } },
                    spinArrows: { pathLength: 1 }
                }}
            />

            <motion.g
                style={{ transformOrigin: "12px 16px" }}
                variants={{
                    normal: { rotate: 0, opacity: 1, transition: { duration: 0.3 } },
                    hidden: { rotate: 0, opacity: 0, transition: { duration: 0 } },
                    drawCloud: { opacity: 0 },
                    spinArrows: {
                        opacity: 1,
                        rotate: 360,
                        transition: {
                            opacity: { duration: 0.2 },
                            rotate: { duration: 1.5, ease: "linear" }
                        }
                    }
                }}
            >
                <motion.path d="m17 18-1.535 1.605a5 5 0 0 1-8-1.5" />
                <motion.path d="M17 22v-4h-4" />
                <motion.path d="M7 10v4h4" />
                <motion.path d="m7 14 1.535-1.605a5 5 0 0 1 8 1.5" />
            </motion.g>
        </IconWrapper>
    );
};

export const AnimatedFactory = ({ isHovered, ...props }: AnimatedIconProps) => {
    const controls = useAnimation();

    useEffect(() => {
        const sequence = async () => {
            if (isHovered) {
                await controls.start("hidden");
                await controls.start("drawOutline");
                await controls.start("showDots");
            } else {
                controls.start("normal");
            }
        };
        sequence();
    }, [isHovered, controls]);

    const dotSpring = { type: "spring", stiffness: 400, damping: 10 } as any;

    return (
        <IconWrapper controls={controls} {...props}>
            <motion.path
                d="M3 19a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V8.5a.5.5 0 0 0-.769-.422l-4.462 2.844A.5.5 0 0 1 15 10.5v-2a.5.5 0 0 0-.769-.422L9.77 10.922A.5.5 0 0 1 9 10.5V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2z"
                variants={{
                    normal: { pathLength: 1, opacity: 1, transition: { duration: 0.3 } },
                    hidden: { pathLength: 0, opacity: 1, transition: { duration: 0 } },
                    drawOutline: { pathLength: [0, 1], transition: { duration: 0.6, ease: "easeInOut" } },
                    showDots: { pathLength: 1 }
                }}
            />
            <motion.path
                d="M8 16h.01"
                variants={{
                    normal: { opacity: 1, y: 0 },
                    hidden: { opacity: 0, y: -2, transition: { duration: 0 } },
                    drawOutline: { opacity: 0, y: -2 },
                    showDots: { opacity: 1, y: 0, transition: { ...dotSpring, delay: 0 } }
                }}
            />
            <motion.path
                d="M12 16h.01"
                variants={{
                    normal: { opacity: 1, y: 0 },
                    hidden: { opacity: 0, y: -2, transition: { duration: 0 } },
                    drawOutline: { opacity: 0, y: -2 },
                    showDots: { opacity: 1, y: 0, transition: { ...dotSpring, delay: 0.15 } }
                }}
            />
            <motion.path
                d="M16 16h.01"
                variants={{
                    normal: { opacity: 1, y: 0 },
                    hidden: { opacity: 0, y: -2, transition: { duration: 0 } },
                    drawOutline: { opacity: 0, y: -2 },
                    showDots: { opacity: 1, y: 0, transition: { ...dotSpring, delay: 0.3 } }
                }}
            />
        </IconWrapper>
    );
};

export const AnimatedFolderArchive = ({ isHovered, ...props }: AnimatedIconProps) => {
    const controls = useIconAnimation(isHovered);
    return (
        <IconWrapper controls={controls} {...props}>
            <path d="M20.9 19.8A2 2 0 0 0 22 18V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2h5.1" />
            <motion.g variants={{ normal: { opacity: 1 }, animate: { opacity: [1, 0, 1], transition: { duration: 0.6, ease: "easeInOut" } } } as any}>
                <circle cx="15" cy="19" r="2" />
                <path d="M15 11v-1" />
                <path d="M15 17v-2" />
            </motion.g>
        </IconWrapper>
    );
};

export const AnimatedFolderCode = ({ isHovered, ...props }: AnimatedIconProps) => {
    const controls = useIconAnimation(isHovered);
    const codeVar = (d: number) => ({ normal: { x: 0, rotate: 0, opacity: 1 }, animate: { x: [0, d * 2, 0], rotate: [0, d * -8, 0], transition: { duration: 0.5, ease: "easeInOut" } } } as any);
    return (
        <IconWrapper controls={controls} {...props}>
            <path d="M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2z" />
            <motion.path d="M10 10.5 8 13l2 2.5" variants={codeVar(-1)} />
            <motion.path d="m14 10.5 2 2.5-2 2.5" variants={codeVar(1)} />
        </IconWrapper>
    );
};

export const AnimatedGalleryThumbnails = ({ isHovered, ...props }: AnimatedIconProps) => {
    const controls = useIconAnimation(isHovered);
    return (
        <IconWrapper controls={controls} {...props}>
            <rect height="14" rx="2" width="18" x="3" y="3" />
            {["M4 21h1", "M9 21h1", "M14 21h1", "M19 21h1"].map((d, index) => (
                <motion.path key={d} d={d} variants={{ normal: { opacity: 1 }, animate: { opacity: [0, 1], transition: { delay: (index + 1) * 0.15, duration: 0.2 } } } as any} />
            ))}
        </IconWrapper>
    );
};

export const AnimatedGauge = ({ isHovered, ...props }: AnimatedIconProps) => {
    const controls = useIconAnimation(isHovered);
    return (
        <IconWrapper controls={controls} {...props}>
            <motion.path d="m12 14 4-4" variants={{ normal: { translateX: 0, rotate: 0, translateY: 0 }, animate: { translateX: 0.5, translateY: 3, rotate: 72, transition: { type: "spring", stiffness: 160, damping: 17, mass: 1 } } } as any} />
            <path d="M3.34 19a10 10 0 1 1 17.32 0" />
        </IconWrapper>
    );
};

export const AnimatedGavel = ({ isHovered, ...props }: AnimatedIconProps) => {
    const controls = useIconAnimation(isHovered);
    return (
        <IconWrapper controls={controls} {...props}>
            <motion.g style={{ transformOrigin: "0% 100%", transformBox: "fill-box" }} variants={{ normal: { rotate: 0 }, animate: { rotate: [0, -20, 25, 0], transition: { duration: 0.8, times: [0, 0.6, 0.8, 1], ease: ["easeInOut", "easeOut", "easeOut"] } } } as any}>
                <path d="m14 13-8.381 8.38a1 1 0 0 1-3.001-3l8.384-8.381" />
                <path d="m16 16 6-6" />
                <path d="m21.5 10.5-8-8" />
                <path d="m8 8 6-6" />
                <path d="m8.5 7.5 8 8" />
            </motion.g>
        </IconWrapper>
    );
};

export const AnimatedGeorgianLari = ({ isHovered, ...props }: AnimatedIconProps) => {
    const controls = useIconAnimation(isHovered);
    return (
        <IconWrapper controls={controls} {...props}>
            <motion.path d="M11.5 21a7.5 7.5 0 1 1 7.35-9" variants={{ normal: { opacity: 1, pathLength: 1 }, animate: { opacity: [0, 1], pathLength: [0, 1], transition: { duration: 0.6 } } } as any} />
            <motion.path d="M4 21h16" variants={{ normal: { opacity: 1, pathLength: 1 }, animate: { opacity: [0, 1], pathLength: [0, 1], transition: { duration: 0.6 } } } as any} />
            <motion.path d="M9 12V3" variants={{ normal: { opacity: 1, pathLength: 1, pathOffset: 0 }, animate: { opacity: [0, 1], pathLength: [0, 1], pathOffset: [1, 0], transition: { delay: 0.5, duration: 0.4 } } } as any} />
            <motion.path d="M13 12V3" variants={{ normal: { opacity: 1, pathLength: 1, pathOffset: 0 }, animate: { opacity: [0, 1], pathLength: [0, 1], pathOffset: [1, 0], transition: { delay: 0.5, duration: 0.4 } } } as any} />
        </IconWrapper>
    );
};

export const AnimatedGrip = ({ isHovered, ...props }: AnimatedIconProps) => {
    const controls = useIconAnimation(isHovered);
    const CIRCLES = [{ cx: 19, cy: 5 }, { cx: 19, cy: 12 }, { cx: 12, cy: 5 }, { cx: 19, cy: 19 }, { cx: 12, cy: 12 }, { cx: 5, cy: 5 }, { cx: 12, cy: 19 }, { cx: 5, cy: 12 }, { cx: 5, cy: 19 }];
    return (
        <IconWrapper controls={controls} {...props}>
            {CIRCLES.map((circle, index) => (
                <motion.circle key={`${circle.cx}-${circle.cy}`} cx={circle.cx} cy={circle.cy} r="1" variants={{ normal: { opacity: 1 }, animate: { opacity: [1, 0.3, 0.3, 1], transition: { delay: index * 0.07, duration: 1.1, times: [0, 0.2, 0.8, 1] } } } as any} />
            ))}
        </IconWrapper>
    );
};

export const AnimatedGripHorizontal = ({ isHovered, ...props }: AnimatedIconProps) => {
    const controls = useIconAnimation(isHovered);
    const CIRCLES = [{ cx: 5, cy: 9 }, { cx: 12, cy: 9 }, { cx: 19, cy: 9 }, { cx: 5, cy: 15 }, { cx: 12, cy: 15 }, { cx: 19, cy: 15 }];
    return (
        <IconWrapper controls={controls} {...props}>
            {CIRCLES.map((circle, index) => {
                const row = Math.floor(index / 3);
                const col = index % 3;
                const delay = col * 0.15 + row * 0.25;
                return (
                    <motion.circle key={`${circle.cx}-${circle.cy}`} cx={circle.cx} cy={circle.cy} r="1" variants={{ normal: { opacity: 1, scale: 1 }, animate: { opacity: [1, 0.4, 1], scale: [1, 0.85, 1], transition: { delay, duration: 1, ease: "easeInOut" } } } as any} />
                );
            })}
        </IconWrapper>
    );
};

export const AnimatedGripVertical = ({ isHovered, ...props }: AnimatedIconProps) => {
    const controls = useIconAnimation(isHovered);
    const CIRCLES = [{ cx: 9, cy: 5 }, { cx: 9, cy: 12 }, { cx: 9, cy: 19 }, { cx: 15, cy: 5 }, { cx: 15, cy: 12 }, { cx: 15, cy: 19 }];
    const ROWS = 3;
    return (
        <IconWrapper controls={controls} {...props}>
            {CIRCLES.map((circle, index) => {
                const row = index % ROWS;
                const col = Math.floor(index / ROWS);
                const delay = row * 0.15 + col * (ROWS * 0.15 - 0.2);
                return (
                    <motion.circle key={`${circle.cx}-${circle.cy}`} cx={circle.cx} cy={circle.cy} r="1" variants={{ normal: { opacity: 1, scale: 1 }, animate: { opacity: [1, 0.4, 1], scale: [1, 0.85, 1], transition: { delay, duration: 1, ease: "easeInOut" } } } as any} />
                );
            })}
        </IconWrapper>
    );
};

export const AnimatedHandCoins = ({ isHovered, ...props }: AnimatedIconProps) => {
    const controls = useIconAnimation(isHovered);
    return (
        <IconWrapper controls={controls} {...props}>
            <path d="M11 15h2a2 2 0 1 0 0-4h-3c-.6 0-1.1.2-1.4.6L3 17" />
            <path d="m7 21 1.6-1.4c.3-.4.8-.6 1.4-.6h4c1.1 0 2.1-.4 2.8-1.2l4.6-4.4a2 2 0 0 0-2.75-2.91l-4.2 3.9" />
            <path d="m2 16 6 6" />
            <motion.circle cx="16" cy="9" r="2.9" variants={{ normal: { translateY: 0, opacity: 1 }, animate: { opacity: [0, 1], translateY: [-20, 0], transition: { type: "spring", stiffness: 150, damping: 15, bounce: 0.8 } } } as any} />
            <motion.circle cx="6" cy="5" r="3" variants={{ normal: { translateY: 0, opacity: 1 }, animate: { opacity: [0, 1], translateY: [-20, 0], transition: { delay: 0.15, type: "spring", stiffness: 150, damping: 15, bounce: 0.8 } } } as any} />
        </IconWrapper>
    );
};

export const AnimatedHandFist = ({ isHovered, ...props }: AnimatedIconProps) => {
    const controls = useIconAnimation(isHovered);
    return (
        <IconWrapper controls={controls} {...props}>
            <motion.g variants={{ normal: { y: 0, scale: 1 }, animate: { y: [0, -4, 0], scale: [1, 1.1, 1], transition: { duration: 0.4, ease: "easeInOut" } } } as any}>
                <path d="M12.035 17.012a3 3 0 0 0-3-3l-.311-.002a.72.72 0 0 1-.505-1.229l1.195-1.195A2 2 0 0 1 10.828 11H12a2 2 0 0 0 0-4H9.243a3 3 0 0 0-2.122.879l-2.707 2.707A4.83 4.83 0 0 0 3 14a8 8 0 0 0 8 8h2a8 8 0 0 0 8-8V7a2 2 0 1 0-4 0v2a2 2 0 1 0 4 0" />
                <path d="M13.888 9.662A2 2 0 0 0 17 8V5A2 2 0 1 0 13 5" />
                <path d="M9 5A2 2 0 1 0 5 5V10" />
                <path d="M9 7V4A2 2 0 1 1 13 4V7.268" />
            </motion.g>
        </IconWrapper>
    );
};

export const AnimatedHandGrab = ({ isHovered, ...props }: AnimatedIconProps) => {
    const controls = useIconAnimation(isHovered);
    return (
        <IconWrapper controls={controls} {...props}>
            <motion.g variants={{ normal: { scale: 1 }, animate: { scale: [1, 0.9, 1], transition: { duration: 0.4, ease: "easeInOut" } } } as any}>
                <path d="M18 11.5V9a2 2 0 0 0-2-2a2 2 0 0 0-2 2v1.4" />
                <path d="M14 10V8a2 2 0 0 0-2-2a2 2 0 0 0-2 2v2" />
                <path d="M10 9.9V9a2 2 0 0 0-2-2a2 2 0 0 0-2 2v5" />
                <path d="M6 14a2 2 0 0 0-2-2a2 2 0 0 0-2 2" />
                <path d="M18 11a2 2 0 1 1 4 0v3a8 8 0 0 1-8 8h-4a8 8 0 0 1-8-8 2 2 0 1 1 4 0" />
            </motion.g>
        </IconWrapper>
    );
};

export const AnimatedHandHeart = ({ isHovered, ...props }: AnimatedIconProps) => {
    const controls = useIconAnimation(isHovered);
    return (
        <IconWrapper controls={controls} {...props}>
            <path d="M11 14h2a2 2 0 1 0 0-4h-3c-.6 0-1.1.2-1.4.6L3 16" />
            <path d="m7 20 1.6-1.4c.3-.4.8-.6 1.4-.6h4c1.1 0 2.1-.4 2.8-1.2l4.6-4.4a2 2 0 0 0-2.75-2.91l-4.2 3.9" />
            <path d="m2 15 6 6" />
            <motion.path style={{ transformOrigin: "18px 18px" }} d="M19.5 8.5c.7-.7 1.5-1.6 1.5-2.7A2.73 2.73 0 0 0 16 4a2.78 2.78 0 0 0-5 1.8c0 1.2.8 2 1.5 2.8L16 12Z" variants={{ normal: { scale: 1, opacity: 0.9 }, animate: { scale: [1, 1.12, 1.04, 1.12, 1], opacity: [0.9, 1, 0.85, 1, 0.9], transition: { duration: 0.8, repeat: Infinity, ease: "easeInOut" } } } as any} />
        </IconWrapper>
    );
};

export const AnimatedHandHelping = ({ isHovered, ...props }: AnimatedIconProps) => {
    const controls = useIconAnimation(isHovered);
    return (
        <IconWrapper controls={controls} {...props}>
            <motion.g variants={{ normal: { x: 0, y: 0 }, animate: { x: [0, 2, 0], y: [0, -2, 0], transition: { duration: 0.5, ease: "easeInOut" } } } as any}>
                <path d="M11 12h2a2 2 0 1 0 0-4h-3c-.6 0-1.1.2-1.4.6L3 14" />
                <path d="m7 18 1.6-1.4c.3-.4.8-.6 1.4-.6h4c1.1 0 2.1-.4 2.8-1.2l4.6-4.4a2 2 0 0 0-2.75-2.91l-4.2 3.9" />
                <path d="m2 13 6 6" />
            </motion.g>
        </IconWrapper>
    );
};

export const AnimatedHandMetal = ({ isHovered, ...props }: AnimatedIconProps) => {
    const controls = useIconAnimation(isHovered);
    return (
        <IconWrapper controls={controls} {...props}>
            <motion.g style={{ originX: "50%", originY: "90%" }} variants={{ normal: { rotate: 0 }, animate: { rotate: [0, -15, 15, -10, 10, 0], transition: { duration: 0.6, ease: "easeInOut" } } } as any}>
                <path d="M18 12.5V10a2 2 0 0 0-2-2a2 2 0 0 0-2 2v1.4" />
                <path d="M14 11V9a2 2 0 1 0-4 0v2" />
                <path d="M10 10.5V5a2 2 0 1 0-4 0v9" />
                <path d="m7 15-1.76-1.76a2 2 0 0 0-2.83 2.82l3.6 3.6C7.5 21.14 9.2 22 12 22h2a8 8 0 0 0 8-8V7a2 2 0 1 0-4 0v5" />
            </motion.g>
        </IconWrapper>
    );
};

export const AnimatedGraduationCap = ({ isHovered, ...props }: AnimatedIconProps) => {
    const controls = useIconAnimation(isHovered);
    return (
        <IconWrapper controls={controls} {...props}>
            <motion.g style={{ transformOrigin: "12px 12px" }} variants={{ normal: { rotate: 0 }, animate: { y: [0, -2, 0], rotate: [0, -2, 2, 0], transition: { duration: 0.6, ease: "easeInOut" } } } as any}>
                <path d="M2 10l10-5 10 5-10 5z" />
                <path d="M6 12v5c3 3 9 3 12 0v-5" />
                <motion.path d="M22 10v6" style={{ transformBox: "fill-box", transformOrigin: "top center" }} variants={{ normal: { rotate: 0 }, animate: { rotate: [0, 15, -10, 5, 0], transition: { duration: 0.8, delay: 0.1, ease: "easeInOut" } } } as any} />
            </motion.g>
        </IconWrapper>
    );
};

export const AnimatedHammer = ({ isHovered, ...props }: AnimatedIconProps) => {
    const controls = useIconAnimation(isHovered);
    return (
        <IconWrapper controls={controls} {...props}>
            <motion.g style={{ transformOrigin: "0% 100%", transformBox: "fill-box" }} variants={{ normal: { rotate: 0 }, animate: { rotate: [0, -20, 25, 0], transition: { duration: 0.8, times: [0, 0.6, 0.8, 1], ease: ["easeInOut", "easeOut", "easeOut"] } } } as any}>
                <path d="m15 12-9.373 9.373a1 1 0 0 1-3.001-3L12 9" />
                <path d="m18 15 4-4" />
                <path d="m21.5 11.5-1.914-1.914A2 2 0 0 1 19 8.172v-.344a2 2 0 0 0-.586-1.414l-1.657-1.657A6 6 0 0 0 12.516 3H9l1.243 1.243A6 6 0 0 1 12 8.485V10l2 2h1.172a2 2 0 0 1 1.414.586L18.5 14.5" />
            </motion.g>
        </IconWrapper>
    );
};

export const AnimatedHand = ({ isHovered, ...props }: AnimatedIconProps) => {
    const controls = useIconAnimation(isHovered);
    return (
        <IconWrapper controls={controls} {...props}>
            <motion.g variants={{ normal: { rotate: 0, originX: "50%", originY: "90%" }, animate: { rotate: [0, -15, 10, -5, 0], transition: { duration: 0.8, ease: "easeInOut" } } } as any}>
                <path d="M18 11V6a2 2 0 0 0-2-2a2 2 0 0 0-2 2" />
                <path d="M14 10V4a2 2 0 0 0-2-2a2 2 0 0 0-2 2v2" />
                <path d="M10 10.5V6a2 2 0 0 0-2-2a2 2 0 0 0-2 2v8" />
                <path d="M18 8a2 2 0 1 1 4 0v6a8 8 0 0 1-8 8h-2c-2.8 0-4.5-.86-5.99-2.34l-3.6-3.6a2 2 0 0 1 2.83-2.82L7 15" />
            </motion.g>
        </IconWrapper>
    );
};

export const AnimatedHardDriveDownload = ({ isHovered, ...props }: AnimatedIconProps) => {
    const controls = useIconAnimation(isHovered);
    return (
        <IconWrapper controls={controls} {...props}>
            <rect height="8" rx="2" width="20" x="2" y="14" />
            <path d="M6 18h.01" /><path d="M10 18h.01" />
            <motion.g variants={{ normal: { y: -1 }, animate: { y: 0, transition: { type: "spring", stiffness: 200, damping: 10, mass: 1 } } } as any}>
                <path d="M12 2v8" /><path d="m16 6-4 4-4-4" />
            </motion.g>
        </IconWrapper>
    );
};

export const AnimatedHardDriveUpload = ({ isHovered, ...props }: AnimatedIconProps) => {
    const controls = useIconAnimation(isHovered);
    return (
        <IconWrapper controls={controls} {...props}>
            <rect height="8" rx="2" width="20" x="2" y="14" />
            <path d="M6 18h.01" /><path d="M10 18h.01" />
            <motion.g variants={{ normal: { y: 0 }, animate: { y: -1, transition: { type: "spring", stiffness: 200, damping: 10, mass: 1 } } } as any}>
                <path d="m16 6-4-4-4 4" /><path d="M12 2v8" />
            </motion.g>
        </IconWrapper>
    );
};

export const AnimatedHeart = ({ isHovered, ...props }: AnimatedIconProps) => {
    const controls = useIconAnimation(isHovered);
    return (
        <IconWrapper controls={controls} {...props}>
            <motion.path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" variants={{ normal: { scale: 1 }, animate: { scale: [1, 1.08, 1], transition: { duration: 0.45, repeat: 2 } } } as any} />
        </IconWrapper>
    );
};

export const AnimatedHeartHandshake = ({ isHovered, ...props }: AnimatedIconProps) => {
    const controls = useIconAnimation(isHovered);
    return (
        <IconWrapper
            controls={controls}
            {...props}
            style={{ transformOrigin: "50% 50%" }}
            variants={{
                normal: { scale: 1, rotate: 0 },
                animate: {
                    scale: [1, 0.9, 1, 1, 1, 1, 1],
                    rotate: [0, 0, 0, -7, 7, -3, 0],
                    transition: { duration: 0.7, times: [0, 0.15, 0.3, 0.4, 0.55, 0.75, 1], ease: "easeInOut" }
                }
            } as any}
        >
            <path d="M19.414 14.414C21 12.828 22 11.5 22 9.5a5.5 5.5 0 0 0-9.591-3.676.6.6 0 0 1-.818.001A5.5 5.5 0 0 0 2 9.5c0 2.3 1.5 4 3 5.5l5.535 5.362a2 2 0 0 0 2.879.052 2.12 2.12 0 0 0-.004-3 2.124 2.124 0 1 0 3-3 2.124 2.124 0 0 0 3.004 0 2 2 0 0 0 0-2.828l-1.881-1.882a2.41 2.41 0 0 0-3.409 0l-1.71 1.71a2 2 0 0 1-2.828 0 2 2 0 0 1 0-2.828l2.823-2.762" />
        </IconWrapper>
    );
};

export const AnimatedHeartPulse = ({ isHovered, ...props }: AnimatedIconProps) => {
    const controls = useIconAnimation(isHovered);
    return (
        <IconWrapper controls={controls} {...props}>
            <motion.g style={{ transformOrigin: "12px 12px" }} variants={{ normal: { scale: 1 }, animate: { scale: [1, 1.08, 1], transition: { duration: 0.9, ease: "easeInOut" } } } as any}>
                <motion.path d="M2 9.5a5.5 5.5 0 0 1 9.591-3.676.56.56 0 0 0 .818 0A5.49 5.49 0 0 1 22 9.5c0 2.29-1.5 4-3 5.5l-5.492 5.313a2 2 0 0 1-3 .019L5 15c-1.5-1.5-3-3.2-3-5.5" variants={{ normal: { pathLength: 1, opacity: 1 }, animate: { pathLength: [0, 1], opacity: [0, 1], transition: { duration: 0.5, ease: "easeOut" } } } as any} />
            </motion.g>
            <motion.path d="M3.22 13H9.5l.5-1 2 4.5 2-7 1.5 3.5h5.27" variants={{ normal: { pathLength: 1, pathOffset: 0, opacity: 1 }, animate: { pathLength: [0, 1], pathOffset: [1, 0], opacity: [0, 1], transition: { duration: 0.6, ease: "linear" } } } as any} />
        </IconWrapper>
    );
};

export const AnimatedHistory = ({ isHovered, ...props }: AnimatedIconProps) => {
    const controls = useIconAnimation(isHovered);
    const t = { type: "spring", stiffness: 250, damping: 25 } as any;
    return (
        <IconWrapper controls={controls} {...props}>
            <motion.g variants={{ normal: { rotate: "0deg" }, animate: { rotate: "-50deg", transition: t } } as any}>
                <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" /><path d="M3 3v5h5" />
            </motion.g>
            <motion.line x1="12" x2="12" y1="12" y2="7" variants={{ normal: { rotate: 0, originX: "0%", originY: "100%" }, animate: { rotate: -360, originX: "0%", originY: "100%", transition: { duration: 0.6, ease: [0.4, 0, 0.2, 1] } } } as any} />
            <motion.line x1="12" x2="16" y1="12" y2="14" variants={{ normal: { rotate: 0, originX: "0%", originY: "0%" }, animate: { rotate: -45, originX: "0%", originY: "0%", transition: { duration: 0.5, ease: "easeInOut" } } } as any} />
        </IconWrapper>
    );
};

export const AnimatedHome = ({ isHovered, ...props }: AnimatedIconProps) => {
    const controls = useIconAnimation(isHovered);
    return (
        <IconWrapper controls={controls} {...props}>
            <path d="M3 10a2 2 0 0 1 .709-1.528l7-5.999a2 2 0 0 1 2.582 0l7 5.999A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
            <motion.path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8" variants={{ normal: { pathLength: 1, opacity: 1 }, animate: { opacity: [0, 1], pathLength: [0, 1], transition: { duration: 0.6 } } } as any} />
        </IconWrapper>
    );
};

export const AnimatedHourglass = ({ isHovered, ...props }: AnimatedIconProps) => {
    const controls = useIconAnimation(isHovered);
    return (
        <IconWrapper controls={controls} {...props}>
            <motion.g style={{ transformOrigin: "12px 12px" }} variants={{ normal: { rotate: 0 }, animate: { rotate: 180, transition: { type: "spring", stiffness: 100, damping: 15, mass: 1 } } } as any}>
                <path d="M5 22h14" /><path d="M5 2h14" /><path d="M17 22v-4.172a2 2 0 0 0-.586-1.414L12 12l-4.414 4.414A2 2 0 0 0 7 17.828V22" /><path d="M7 2v4.172a2 2 0 0 0 .586 1.414L12 12l4.414-4.414A2 2 0 0 0 17 6.172V2" />
            </motion.g>
        </IconWrapper>
    );
};

export const AnimatedIdCard = ({ isHovered, ...props }: AnimatedIconProps) => {
    const controls = useIconAnimation(isHovered);
    const lineVar = (delay: number) => ({ normal: { pathLength: 1, opacity: 1 }, animate: { pathLength: [0, 1], opacity: [0, 1], transition: { duration: 0.3, delay } } } as any);
    return (
        <IconWrapper controls={controls} {...props}>
            <rect height="14" rx="2" width="20" x="2" y="5" />
            <motion.path d="M16 10h2" variants={lineVar(0.2)} />
            <motion.path d="M16 14h2" variants={lineVar(0.2)} />
            <motion.path d="M6.17 15a3 3 0 0 1 5.66 0" variants={lineVar(0)} />
            <motion.circle cx="9" cy="11" r="2" variants={lineVar(0.1)} />
        </IconWrapper>
    );
};

export const AnimatedItalic = ({ isHovered, ...props }: AnimatedIconProps) => {
    const controls = useIconAnimation(isHovered);
    const lineVar = { normal: { pathLength: 1, opacity: 1, pathOffset: 0 }, animate: { pathLength: [0, 1], opacity: [0, 1], pathOffset: [1, 0], transition: { duration: 0.2 } } } as any;
    return (
        <IconWrapper controls={controls} {...props}>
            <motion.line x1="19" x2="10" y1="4" y2="4" variants={lineVar} />
            <motion.line x1="14" x2="5" y1="20" y2="20" variants={lineVar} />
            <motion.line x1="15" x2="9" y1="4" y2="20" variants={{ normal: { pathLength: 1, pathOffset: 0 }, animate: { pathLength: [0, 1], pathOffset: [1, 0], transition: { delay: 0.1, duration: 0.4 } } } as any} />
        </IconWrapper>
    );
};

export const AnimatedJapaneseYen = ({ isHovered, ...props }: AnimatedIconProps) => {
    const controls = useIconAnimation(isHovered);
    return (
        <IconWrapper controls={controls} {...props}>
            <motion.path d="M12 9.5V21m0-11.5L6 3m6 6.5L18 3" variants={{ normal: { opacity: 1, pathLength: 1 }, animate: { opacity: [0, 1], pathLength: [0, 1], transition: { duration: 0.6 } } } as any} />
            <motion.path d="M18 11h-12" variants={{ normal: { opacity: 1, pathLength: 1, pathOffset: 0 }, animate: { opacity: [0, 1], pathLength: [0, 1], pathOffset: [1, 0], transition: { delay: 0.5, duration: 0.4 } } } as any} />
            <motion.path d="M18 15h-12" variants={{ normal: { opacity: 1, pathLength: 1, pathOffset: 0 }, animate: { opacity: [0, 1], pathLength: [0, 1], pathOffset: [1, 0], transition: { delay: 0.5, duration: 0.4 } } } as any} />
        </IconWrapper>
    );
};

export const AnimatedKey = ({ isHovered, ...props }: AnimatedIconProps) => {
    const controls = useIconAnimation(isHovered);
    return (
        <IconWrapper
            controls={controls}
            {...props}
            style={{ transformOrigin: "30% 70%" }}
            variants={{
                normal: { rotate: 0 },
                animate: {
                    rotate: [-3, -33, -25, -28],
                    transition: { duration: 0.6, times: [0, 0.6, 0.8, 1], ease: "easeInOut" }
                }
            } as any}
        >
            <path d="m15.5 7.5 2.3 2.3a1 1 0 0 0 1.4 0l2.1-2.1a1 1 0 0 0 0-1.4L19 4" />
            <path d="m21 2-9.6 9.6" />
            <circle cx="7.5" cy="15.5" r="5.5" />
        </IconWrapper>
    );
};

export const AnimatedKeyCircle = ({ isHovered, ...props }: AnimatedIconProps) => {
    const controls = useIconAnimation(isHovered);
    return (
        <IconWrapper controls={controls} {...props} variants={{ normal: { y: 0, rotate: 0 }, animate: { y: [0, -3, 0, -2, 0], rotate: [0, 3, -3, 0], transition: { duration: 0.9, bounce: 0.5 } } } as any}>
            <path d="M2.586 17.414A2 2 0 0 0 2 18.828V21a1 1 0 0 0 1 1h3a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h1a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h.172a2 2 0 0 0 1.414-.586l.814-.814a6.5 6.5 0 1 0-4-4z" />
            <circle cx="16.5" cy="7.5" fill="currentColor" r=".5" />
        </IconWrapper>
    );
};

export const AnimatedKeySquare = ({ isHovered, ...props }: AnimatedIconProps) => {
    const controls = useIconAnimation(isHovered);
    return (
        <IconWrapper controls={controls} {...props} variants={{ normal: { rotate: 0, scale: 1 }, animate: { rotate: [0, 15, -15, 0], scale: [1, 1.05, 1, 1], transition: { duration: 0.6, bounce: 0.4 } } } as any}>
            <path d="M12.4 2.7a2.5 2.5 0 0 1 3.4 0l5.5 5.5a2.5 2.5 0 0 1 0 3.4l-3.7 3.7a2.5 2.5 0 0 1-3.4 0L8.7 9.8a2.5 2.5 0 0 1 0-3.4z" />
            <path d="m14 7 3 3" />
            <path d="m9.4 10.6-6.814 6.814A2 2 0 0 0 2 18.828V21a1 1 0 0 0 1 1h3a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h1a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h.172a2 2 0 0 0 1.414-.586l.814-.814" />
        </IconWrapper>
    );
};

const KEY_DELAYS = [0.12, 0.85, 0.34, 1.21, 0.56, 0.77, 0.93, 0.45];

export const AnimatedKeyboard = ({ isHovered, ...props }: any) => {
    const controls = useIconAnimation(isHovered);

    const keys = [
        "M10 8h.01", "M12 12h.01", "M14 8h.01", "M16 12h.01",
        "M18 8h.01", "M6 8h.01", "M7 16h10", "M8 12h.01"
    ];

    return (
        <IconWrapper controls={controls} {...props}>
            <rect height="16" rx="2" width="20" x="2" y="4" />
            {keys.map((d, i) => (
                <motion.path
                    key={i}
                    d={d}
                    variants={{
                        normal: { opacity: 1 },
                        animate: {
                            opacity: [1, 0.2, 1],
                            transition: {
                                duration: 1.5,
                                delay: KEY_DELAYS[i],
                                repeat: 1,
                                repeatType: "reverse"
                            }
                        }
                    } as any}
                />
            ))}
        </IconWrapper>
    );
};

export const AnimatedLanguages = ({ isHovered, ...props }: AnimatedIconProps) => {
    const controls = useIconAnimation(isHovered);
    const lineVar = (delay: number) => ({ normal: { opacity: 1, pathLength: 1, pathOffset: 0 }, animate: { opacity: [0, 1], pathLength: [0, 1], pathOffset: [1, 0], transition: { type: "spring", duration: 0.5, bounce: 0, delay } } } as any);
    return (
        <IconWrapper controls={controls} {...props} variants={{ normal: { opacity: 1 }, animate: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.2 } } } as any}>
            <motion.path d="m5 8 6 6" variants={lineVar(0.3)} />
            <motion.path d="m4 14 6-6 3-3" variants={lineVar(0.2)} />
            <motion.path d="M2 5h12" variants={lineVar(0.1)} />
            <motion.path d="M7 2h1" variants={lineVar(0)} />
            <motion.path d="m22 22-5-10-5 10" variants={lineVar(0.3)} />
            <motion.path d="M14 18h6" variants={lineVar(0.3)} />
        </IconWrapper>
    );
};

export const AnimatedLayers = ({ isHovered, ...props }: AnimatedIconProps) => {
    const controls = useIconAnimation(isHovered);
    const t = { type: "spring", stiffness: 100, damping: 14, mass: 1 } as any;

    useEffect(() => {
        const sequence = async () => {
            if (isHovered) {
                await controls.start("firstState");
                await controls.start("secondState");
            } else {
                controls.start("normal");
            }
        };
        sequence();
    }, [isHovered, controls]);

    return (
        <IconWrapper controls={controls} {...props}>
            <path d="m12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83Z" />
            <motion.path
                d="m22 17.65-9.17 4.16a2 2 0 0 1-1.66 0L2 17.65"
                variants={{ normal: { y: 0 }, firstState: { y: -9 }, secondState: { y: 0 } }}
                transition={t}
            />
            <motion.path
                d="m22 12.65-9.17 4.16a2 2 0 0 1-1.66 0L2 12.65"
                variants={{ normal: { y: 0 }, firstState: { y: -5 }, secondState: { y: 0 } }}
                transition={t}
            />
        </IconWrapper>
    );
};

export const AnimatedLayoutGrid = ({ isHovered, ...props }: AnimatedIconProps) => {
    const controls = useIconAnimation(isHovered);
    const t = { duration: 0.8, ease: "easeInOut", times: [0, 0.4, 0.6, 1] } as any;
    return (
        <IconWrapper controls={controls} {...props}>
            <motion.rect x="3" y="3" width="7" height="7" rx="1" variants={{ normal: { translateX: 0, translateY: 0 }, animate: { translateX: [0, 11, 11, 0], translateY: 0, transition: t } }} />
            <motion.rect x="14" y="3" width="7" height="7" rx="1" variants={{ normal: { translateX: 0, translateY: 0 }, animate: { translateX: 0, translateY: [0, 11, 11, 0], transition: t } }} />
            <motion.rect x="14" y="14" width="7" height="7" rx="1" variants={{ normal: { translateX: 0, translateY: 0 }, animate: { translateX: [0, -11, -11, 0], translateY: 0, transition: t } }} />
            <motion.rect x="3" y="14" width="7" height="7" rx="1" variants={{ normal: { translateX: 0, translateY: 0 }, animate: { translateX: 0, translateY: [0, -11, -11, 0], transition: t } }} />
        </IconWrapper>
    );
};

export const AnimatedLink = ({ isHovered, ...props }: AnimatedIconProps) => {
    const controls = useIconAnimation(isHovered);
    const pathVar = { normal: { pathLength: 1, pathOffset: 0, rotate: 0 }, animate: { pathLength: [1, 0.97, 1, 0.97, 1], pathOffset: [0, 0.05, 0, 0.05, 0], rotate: [0, -5, 0], transition: { duration: 1, times: [0, 0.2, 0.4, 0.6, 1], ease: "easeInOut" } } } as any;
    return (
        <IconWrapper controls={controls} {...props}>
            <motion.path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" variants={pathVar} />
            <motion.path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" variants={pathVar} />
        </IconWrapper>
    );
};

export const AnimatedLoader = ({ isHovered, ...props }: AnimatedIconProps) => {
    const controls = useIconAnimation(isHovered);
    return (
        <IconWrapper controls={controls} {...props}>
            <motion.g style={{ transformOrigin: "12px 12px" }} variants={{ normal: { rotate: 0 }, animate: { rotate: 360, transition: { repeat: Infinity, duration: 0.8, ease: "linear" } } } as any}>
                <path d="M12 2v4" /><path d="m16.2 7.8 2.9-2.9" /><path d="M18 12h4" /><path d="m16.2 16.2 2.9 2.9" /><path d="M12 18v4" /><path d="m4.9 19.1 2.9-2.9" /><path d="M2 12h4" /><path d="m4.9 4.9 2.9 2.9" />
            </motion.g>
        </IconWrapper>
    );
};

export const AnimatedLoaderCircle = ({ isHovered, ...props }: AnimatedIconProps) => {
    const controls = useIconAnimation(isHovered);
    return (
        <IconWrapper controls={controls} {...props}>
            <motion.path d="M21 12a9 9 0 1 1-6.219-8.56" style={{ transformOrigin: "12px 12px" }} variants={{ normal: { rotate: 0 }, animate: { rotate: 360, transition: { repeat: Infinity, duration: 0.8, ease: "linear" } } } as any} />
        </IconWrapper>
    );
};

export const AnimatedLoaderPinwheel = ({ isHovered, ...props }: AnimatedIconProps) => {
    const controls = useIconAnimation(isHovered);
    return (
        <IconWrapper controls={controls} {...props}>
            <motion.g variants={{ normal: { rotate: 0 }, animate: { rotate: 360, transition: { repeat: Infinity, duration: 1, ease: "linear" } } } as any}>
                <path d="M22 12a1 1 0 0 1-10 0 1 1 0 0 0-10 0" />
                <path d="M7 20.7a1 1 0 1 1 5-8.7 1 1 0 1 0 5-8.6" />
                <path d="M7 3.3a1 1 0 1 1 5 8.6 1 1 0 1 0 5 8.6" />
            </motion.g>
            <circle cx="12" cy="12" r="10" />
        </IconWrapper>
    );
};

export const AnimatedLock = ({ isHovered, ...props }: AnimatedIconProps) => {
    const controls = useIconAnimation(isHovered);
    return (
        <IconWrapper controls={controls} {...props} variants={{ normal: { rotate: 0, scale: 1 }, animate: { rotate: [-3, 1, -2, 0], scale: [0.95, 1.05, 0.98, 1], transition: { duration: 1, ease: [0.4, 0, 0.2, 1] } } } as any}>
            <rect height="11" rx="2" ry="2" width="18" x="3" y="11" />
            <motion.path d="M7 11V7a5 5 0 0 1 10 0v4" variants={{ normal: { pathLength: 1 }, animate: { pathLength: 0.7, transition: { duration: 0.3, ease: [0.4, 0, 0.2, 1] } } } as any} />
        </IconWrapper>
    );
};

export const AnimatedLockKeyhole = ({ isHovered, ...props }: AnimatedIconProps) => {
    const controls = useIconAnimation(isHovered);
    return (
        <IconWrapper controls={controls} {...props} variants={{ normal: { rotate: 0, scale: 1 }, animate: { rotate: [-3, 1, -2, 0], scale: [0.95, 1.05, 0.98, 1], transition: { duration: 1, ease: [0.4, 0, 0.2, 1] } } } as any}>
            <circle cx="12" cy="16" r="1" />
            <rect height="12" rx="2" width="18" x="3" y="10" />
            <motion.path d="M7 10V7a5 5 0 0 1 10 0v3" variants={{ normal: { pathLength: 1 }, animate: { pathLength: 0.7, transition: { duration: 0.3, ease: [0.4, 0, 0.2, 1] } } } as any} />
        </IconWrapper>
    );
};

export const AnimatedLockOpen = ({ isHovered, ...props }: AnimatedIconProps) => {
    const controls = useIconAnimation(isHovered);
    return (
        <IconWrapper controls={controls} {...props} variants={{ normal: { rotate: 0, scale: 1 }, animate: { rotate: [2, 4, -2, 0], scale: [1.05, 0.95, 1.02, 1], transition: { duration: 1, ease: [0.4, 0, 0.2, 1] } } } as any}>
            <rect height="11" rx="2" ry="2" width="18" x="3" y="11" />
            <motion.path d="M7 11V7a5 5 0 0 1 10 0v4" variants={{ normal: { pathLength: 0.8 }, animate: { pathLength: 1, transition: { duration: 0.3, ease: [0.4, 0, 0.2, 1] } } } as any} />
        </IconWrapper>
    );
};

export const AnimatedLogIn = ({ isHovered, ...props }: AnimatedIconProps) => {
    const controls = useIconAnimation(isHovered);
    return (
        <IconWrapper controls={controls} {...props}>
            <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
            <motion.polyline points="10 17 15 12 10 7" variants={{ normal: { translateX: 0 }, animate: { x: -2, translateX: [0, 3, 0], transition: { duration: 0.4 } } } as any} />
            <motion.line x1="3" x2="15" y1="12" y2="12" variants={{ normal: { translateX: 0 }, animate: { x: -2, translateX: [0, 3, 0], transition: { duration: 0.4 } } } as any} />
        </IconWrapper>
    );
};

export const AnimatedLogOut = ({ isHovered, ...props }: AnimatedIconProps) => {
    const controls = useIconAnimation(isHovered);
    return (
        <IconWrapper controls={controls} {...props}>
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
            <motion.polyline points="16 17 21 12 16 7" variants={{ normal: { translateX: 0 }, animate: { x: 2, translateX: [0, -3, 0], transition: { duration: 0.4 } } } as any} />
            <motion.line x1="21" x2="9" y1="12" y2="12" variants={{ normal: { translateX: 0 }, animate: { x: 2, translateX: [0, -3, 0], transition: { duration: 0.4 } } } as any} />
        </IconWrapper>
    );
};

export const AnimatedMailCheck = ({ isHovered, ...props }: AnimatedIconProps) => {
    const controls = useIconAnimation(isHovered);
    return (
        <IconWrapper controls={controls} {...props}>
            <path d="M22 13V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v12c0 1.1.9 2 2 2h8" />
            <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
            <motion.path d="m16 19 2 2 4-4" style={{ transformOrigin: "center" }} variants={{ normal: { pathLength: 1, opacity: 1 }, animate: { pathLength: [0, 1], opacity: [0, 1], transition: { duration: 0.4, ease: "easeInOut" } } } as any} />
        </IconWrapper>
    );
};

export const AnimatedMailbox = ({ isHovered, ...props }: AnimatedIconProps) => {
    const controls = useIconAnimation(isHovered);
    return (
        <IconWrapper controls={controls} {...props} className="overflow-visible">
            <path d="M22 17a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V9.5C2 7 4 5 6.5 5H18c2.2 0 4 1.8 4 4v8Z" />
            <motion.path d="M18 11V9H15" style={{ transformOrigin: "18px 11px" }} variants={{ normal: { rotate: 0, transition: { type: "spring", stiffness: 300, damping: 18 } }, animate: { rotate: -90, transition: { type: "spring", stiffness: 280, damping: 12, mass: 1 } } } as any} />
            <path d="M6.5 5C9 5 11 7 11 9.5V17a2 2 0 0 1-2 2" />
            <line x1="6" x2="7" y1="10" y2="10" />
        </IconWrapper>
    );
};

export const AnimatedMapPin = ({ isHovered, ...props }: AnimatedIconProps) => {
    const controls = useIconAnimation(isHovered);
    return (
        <IconWrapper controls={controls} {...props} variants={{ normal: { y: 0 }, animate: { y: [0, -5, -3], transition: { duration: 0.5, times: [0, 0.6, 1] } } } as any}>
            <path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0" />
            <motion.circle cx="12" cy="10" r="3" variants={{ normal: { opacity: 1, pathLength: 1 }, animate: { opacity: [0, 1], pathLength: [0, 1], pathOffset: [0.5, 0], transition: { delay: 0.3, duration: 0.5 } } } as any} />
        </IconWrapper>
    );
};

export const AnimatedMapPinCheck = ({ isHovered, ...props }: AnimatedIconProps) => {
    const controls = useIconAnimation(isHovered);
    return (
        <IconWrapper controls={controls} {...props} variants={{ normal: { y: 0 }, animate: { y: [0, -5, -3], transition: { duration: 0.5, times: [0, 0.6, 1] } } } as any}>
            <path d="M19.43 12.935c.357-.967.57-1.955.57-2.935a8 8 0 0 0-16 0c0 4.993 5.539 10.193 7.399 11.799a1 1 0 0 0 1.202 0 32.197 32.197 0 0 0 .813-.728" />
            <circle cx="12" cy="10" r="3" />
            <motion.path d="m16 18 2 2 4-4" variants={{ normal: { opacity: 1, pathLength: 1 }, animate: { opacity: [0, 1], pathLength: [0, 1], transition: { delay: 0.3, duration: 0.3 } } } as any} />
        </IconWrapper>
    );
};

export const AnimatedMapPinCheckInside = ({ isHovered, ...props }: AnimatedIconProps) => {
    const controls = useIconAnimation(isHovered);
    return (
        <IconWrapper controls={controls} {...props} variants={{ normal: { y: 0 }, animate: { y: [0, -5, -3], transition: { duration: 0.5, times: [0, 0.6, 1] } } } as any}>
            <path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0" />
            <motion.path d="m9 10 2 2 4-4" variants={{ normal: { opacity: 1, pathLength: 1 }, animate: { opacity: [0, 1], pathLength: [0, 1], transition: { delay: 0.3, duration: 0.3 } } } as any} />
        </IconWrapper>
    );
};

export const AnimatedMapPinHouse = ({ isHovered, ...props }: AnimatedIconProps) => {
    const controls = useIconAnimation(isHovered);
    return (
        <IconWrapper controls={controls} {...props} variants={{ normal: { y: 0 }, animate: { y: [0, -5, -3], transition: { duration: 0.5, times: [0, 0.6, 1] } } } as any}>
            <path d="M18 10a8 8 0 0 0-16 0c0 4.993 5.539 10.193 7.399 11.799a1 1 0 0 0 .601.2" />
            <circle cx="10" cy="10" r="3" />
            <motion.path d="M15 22a1 1 0 0 1-1-1v-4a1 1 0 0 1 .445-.832l3-2a1 1 0 0 1 1.11 0l3 2A1 1 0 0 1 22 17v4a1 1 0 0 1-1 1z M18 22v-3" variants={{ normal: { opacity: 1, pathLength: 1 }, animate: { opacity: [0, 1], pathLength: [0, 1], transition: { delay: 0.3, duration: 0.3 } } } as any} />
        </IconWrapper>
    );
};

export const AnimatedMapPinMinus = ({ isHovered, ...props }: AnimatedIconProps) => {
    const controls = useIconAnimation(isHovered);
    return (
        <IconWrapper controls={controls} {...props} variants={{ normal: { y: 0 }, animate: { y: [0, -5, -3], transition: { duration: 0.5, times: [0, 0.6, 1] } } } as any}>
            <path d="M18.977 14C19.6 12.701 20 11.343 20 10a8 8 0 0 0-16 0c0 4.993 5.539 10.193 7.399 11.799a1 1 0 0 0 1.202 0 32 32 0 0 0 .824-.738" />
            <circle cx="12" cy="10" r="3" />
            <motion.path d="M16 18h6" variants={{ normal: { opacity: 1, pathLength: 1 }, animate: { opacity: [0, 1], pathLength: [0, 1], transition: { delay: 0.3, duration: 0.3 } } } as any} />
        </IconWrapper>
    );
};

export const AnimatedMapPinMinusInside = ({ isHovered, ...props }: AnimatedIconProps) => {
    const controls = useIconAnimation(isHovered);
    return (
        <IconWrapper controls={controls} {...props} variants={{ normal: { y: 0 }, animate: { y: [0, -5, -3], transition: { duration: 0.5, times: [0, 0.6, 1] } } } as any}>
            <path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0" />
            <motion.path d="M9 10h6" variants={{ normal: { opacity: 1, pathLength: 1 }, animate: { opacity: [0, 1], pathLength: [0, 1], transition: { delay: 0.3, duration: 0.3 } } } as any} />
        </IconWrapper>
    );
};

export const AnimatedMapPinOff = ({ isHovered, ...props }: AnimatedIconProps) => {
    const controls = useIconAnimation(isHovered);
    return (
        <IconWrapper controls={controls} {...props} variants={{ normal: { y: 0 }, animate: { y: [0, -5, -3], transition: { duration: 0.5, times: [0, 0.6, 1] } } } as any}>
            <path d="M12.75 7.09a3 3 0 0 1 2.16 2.16" />
            <path d="M17.072 17.072c-1.634 2.17-3.527 3.912-4.471 4.727a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 1.432-4.568" />
            <motion.path d="m2 2 20 20" variants={{ normal: { opacity: 1, pathLength: 1 }, animate: { opacity: [0, 1], pathLength: [0, 1], transition: { delay: 0.3, duration: 0.3 } } } as any} />
            <path d="M8.475 2.818A8 8 0 0 1 20 10c0 1.183-.31 2.377-.81 3.533" />
            <path d="M9.13 9.13a3 3 0 0 0 3.74 3.74" />
        </IconWrapper>
    );
};

export const AnimatedMapPinPlus = ({ isHovered, ...props }: AnimatedIconProps) => {
    const controls = useIconAnimation(isHovered);
    return (
        <IconWrapper controls={controls} {...props} variants={{ normal: { y: 0 }, animate: { y: [0, -5, -3], transition: { duration: 0.5, times: [0, 0.6, 1] } } } as any}>
            <path d="M19.914 11.105A7.298 7.298 0 0 0 20 10a8 8 0 0 0-16 0c0 4.993 5.539 10.193 7.399 11.799a1 1 0 0 0 1.202 0 32 32 0 0 0 .824-.738" />
            <circle cx="12" cy="10" r="3" />
            <motion.path d="M16 18h6" variants={{ normal: { opacity: 1, pathLength: 1 }, animate: { opacity: [0, 1], pathLength: [0, 1], transition: { delay: 0.6, duration: 0.2 } } } as any} />
            <motion.path d="M19 15v6" variants={{ normal: { opacity: 1, pathLength: 1 }, animate: { opacity: [0, 1], pathLength: [0, 1], transition: { delay: 0.3, duration: 0.2 } } } as any} />
        </IconWrapper>
    );
};

export const AnimatedMapPinPlusInside = ({ isHovered, ...props }: AnimatedIconProps) => {
    const controls = useIconAnimation(isHovered);
    return (
        <IconWrapper controls={controls} {...props} variants={{ normal: { y: 0 }, animate: { y: [0, -5, -3], transition: { duration: 0.5, times: [0, 0.6, 1] } } } as any}>
            <path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0" />
            <motion.path d="M12 7v6" variants={{ normal: { opacity: 1, pathLength: 1 }, animate: { opacity: [0, 1], pathLength: [0, 1], transition: { delay: 0.6, duration: 0.2 } } } as any} />
            <motion.path d="M9 10h6" variants={{ normal: { opacity: 1, pathLength: 1 }, animate: { opacity: [0, 1], pathLength: [0, 1], transition: { delay: 0.3, duration: 0.2 } } } as any} />
        </IconWrapper>
    );
};

export const AnimatedMapPinXInside = ({ isHovered, ...props }: AnimatedIconProps) => {
    const controls = useIconAnimation(isHovered);
    return (
        <IconWrapper controls={controls} {...props} variants={{ normal: { y: 0 }, animate: { y: [0, -5, -3], transition: { duration: 0.5, times: [0, 0.6, 1] } } } as any}>
            <path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0" />
            <motion.path d="m14.5 7.5-5 5" variants={{ normal: { opacity: 1, pathLength: 1 }, animate: { opacity: [0, 1], pathLength: [0, 1], transition: { delay: 0.3, duration: 0.2 } } } as any} />
            <motion.path d="m9.5 7.5 5 5" variants={{ normal: { opacity: 1, pathLength: 1 }, animate: { opacity: [0, 1], pathLength: [0, 1], transition: { delay: 0.6, duration: 0.2 } } } as any} />
        </IconWrapper>
    );
};

export const AnimatedMaximize = ({ isHovered, ...props }: AnimatedIconProps) => {
    const controls = useIconAnimation(isHovered);
    const t = { type: "spring", stiffness: 250, damping: 25 } as any;
    return (
        <IconWrapper controls={controls} {...props}>
            <motion.path d="M8 3H5a2 2 0 0 0-2 2v3" variants={{ normal: { translateX: "0%", translateY: "0%" }, animate: { translateX: "2px", translateY: "2px", transition: t } }} />
            <motion.path d="M21 8V5a2 2 0 0 0-2-2h-3" variants={{ normal: { translateX: "0%", translateY: "0%" }, animate: { translateX: "-2px", translateY: "2px", transition: t } }} />
            <motion.path d="M3 16v3a2 2 0 0 0 2 2h3" variants={{ normal: { translateX: "0%", translateY: "0%" }, animate: { translateX: "2px", translateY: "-2px", transition: t } }} />
            <motion.path d="M16 21h3a2 2 0 0 0 2-2v-3" variants={{ normal: { translateX: "0%", translateY: "0%" }, animate: { translateX: "-2px", translateY: "-2px", transition: t } }} />
        </IconWrapper>
    );
};

export const AnimatedMaximize2 = ({ isHovered, ...props }: AnimatedIconProps) => {
    const controls = useIconAnimation(isHovered);
    const t = { type: "spring", stiffness: 250, damping: 25 } as any;
    return (
        <IconWrapper controls={controls} {...props}>
            <motion.path d="M3 16.2V21m0 0h4.8M3 21l6-6" variants={{ normal: { translateX: "0%", translateY: "0%" }, animate: { translateX: "-2px", translateY: "2px", transition: t } }} />
            <motion.path d="M21 7.8V3m0 0h-4.8M21 3l-6 6" variants={{ normal: { translateX: "0%", translateY: "0%" }, animate: { translateX: "2px", translateY: "-2px", transition: t } }} />
        </IconWrapper>
    );
};

export const AnimatedMenu = ({ isHovered, ...props }: AnimatedIconProps) => {
    const controls = useIconAnimation(isHovered);
    const t = { type: "spring", stiffness: 260, damping: 20 } as any;
    return (
        <IconWrapper controls={controls} {...props}>
            <motion.line x1="4" x2="20" y1="6" y2="6" variants={{ normal: { rotate: 0, y: 0, opacity: 1 }, animate: { rotate: 45, y: 6, opacity: 1, transition: t } }} />
            <motion.line x1="4" x2="20" y1="12" y2="12" variants={{ normal: { rotate: 0, y: 0, opacity: 1 }, animate: { rotate: 0, y: 0, opacity: 0, transition: t } }} />
            <motion.line x1="4" x2="20" y1="18" y2="18" variants={{ normal: { rotate: 0, y: 0, opacity: 1 }, animate: { rotate: -45, y: -6, opacity: 1, transition: t } }} />
        </IconWrapper>
    );
};

export const AnimatedMessageCircle = ({ isHovered, ...props }: AnimatedIconProps) => {
    const controls = useIconAnimation(isHovered);
    return (
        <IconWrapper controls={controls} {...props} variants={{ normal: { scale: 1, rotate: 0 }, animate: { scale: 1.05, rotate: [0, -7, 7, 0], transition: { rotate: { duration: 0.5, ease: "easeInOut" }, scale: { type: "spring", stiffness: 400, damping: 10 } } } as any }}>
            <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z" />
        </IconWrapper>
    );
};

export const AnimatedMessageCircleCheck = ({ isHovered, ...props }: AnimatedIconProps) => {
    const controls = useIconAnimation(isHovered);
    return (
        <IconWrapper controls={controls} {...props}>
            <path d="M2.992 16.342a2 2 0 0 1 .094 1.167l-1.065 3.29a1 1 0 0 0 1.236 1.168l3.413-.998a2 2 0 0 1 1.099.092 10 10 0 1 0-4.777-4.719" />
            <motion.path d="m9 12 2 2 4-4" style={{ transformOrigin: "center" }} variants={{ normal: { pathLength: 1, opacity: 1 }, animate: { pathLength: [0, 1], opacity: [0, 1], transition: { duration: 0.4, ease: "easeInOut" } } } as any} />
        </IconWrapper>
    );
};

export const AnimatedMessageCircleDashed = ({ isHovered, ...props }: AnimatedIconProps) => {
    const controls = useIconAnimation(isHovered);
    return (
        <IconWrapper controls={controls} {...props}>
            {["M13.5 3.1c-.5 0-1-.1-1.5-.1s-1 .1-1.5.1", "M19.3 6.8a10.45 10.45 0 0 0-2.1-2.1", "M20.9 13.5c.1-.5.1-1 .1-1.5s-.1-1-.1-1.5", "M17.2 19.3a10.45 10.45 0 0 0 2.1-2.1", "M10.5 20.9c.5.1 1 .1 1.5.1s1-.1 1.5-.1", "M3.5 17.5 2 22l4.5-1.5", "M3.1 10.5c0 .5-.1 1-.1 1.5s.1 1 .1 1.5", "M6.8 4.7a10.45 10.45 0 0 0-2.1 2.1"].map((d, index) => (
                <motion.path key={d} d={d} variants={{ normal: { opacity: 1 }, animate: { opacity: [0, 1], transition: { delay: (index + 1) * 0.1, duration: 0.3 } } } as any} />
            ))}
        </IconWrapper>
    );
};

export const AnimatedMessageCircleMore = ({ isHovered, ...props }: AnimatedIconProps) => {
    const controls = useIconAnimation(isHovered);
    const dotVar = (delayFactor: number) => ({ normal: { opacity: 1 }, animate: { opacity: [1, 0, 0, 1, 1, 0, 0, 1], transition: { duration: 1.5, times: [0, 0.1, 0.1 + delayFactor * 0.1, 0.1 + delayFactor * 0.1 + 0.1, 0.5, 0.6, 0.6 + delayFactor * 0.1, 0.6 + delayFactor * 0.1 + 0.1] } } } as any);
    return (
        <IconWrapper controls={controls} {...props}>
            <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z" />
            <motion.path d="M8 12h.01" variants={dotVar(0)} />
            <motion.path d="M12 12h.01" variants={dotVar(1)} />
            <motion.path d="M16 12h.01" variants={dotVar(2)} />
        </IconWrapper>
    );
};

export const AnimatedMessageCirclePlus = ({ isHovered, ...props }: AnimatedIconProps) => {
    const controls = useIconAnimation(isHovered);
    return (
        <IconWrapper controls={controls} {...props}>
            <path d="M2.992 16.342a2 2 0 0 1 .094 1.167l-1.065 3.29a1 1 0 0 0 1.236 1.168l3.413-.998a2 2 0 0 1 1.099.092 10 10 0 1 0-4.777-4.719" />
            <motion.path d="M12 8v8" variants={{ normal: { pathLength: 1, opacity: 1 }, animate: { pathLength: [0, 1], opacity: [0, 1], transition: { duration: 0.4, ease: "easeInOut" } } } as any} />
            <motion.path d="M8 12h8" variants={{ normal: { pathLength: 1, opacity: 1 }, animate: { pathLength: [0, 1], opacity: [0, 1], transition: { duration: 0.4, ease: "easeInOut", delay: 0.2 } } } as any} />
        </IconWrapper>
    );
};

export const AnimatedMessageCircleX = ({ isHovered, ...props }: AnimatedIconProps) => {
    const controls = useIconAnimation(isHovered);
    return (
        <IconWrapper controls={controls} {...props}>
            <path d="M2.992 16.342a2 2 0 0 1 .094 1.167l-1.065 3.29a1 1 0 0 0 1.236 1.168l3.413-.998a2 2 0 0 1 1.099.092 10 10 0 1 0-4.777-4.719" />
            <motion.path d="m15 9-6 6" variants={{ normal: { pathLength: 1, opacity: 1 }, animate: { pathLength: [0, 1], opacity: [0, 1], transition: { duration: 0.4, ease: "easeInOut" } } } as any} />
            <motion.path d="m9 9 6 6" variants={{ normal: { pathLength: 1, opacity: 1 }, animate: { pathLength: [0, 1], opacity: [0, 1], transition: { duration: 0.4, ease: "easeInOut", delay: 0.2 } } } as any} />
        </IconWrapper>
    );
};

export const AnimatedMessageSquare = ({ isHovered, ...props }: AnimatedIconProps) => {
    const controls = useIconAnimation(isHovered);
    return (
        <IconWrapper controls={controls} {...props} variants={{ normal: { scale: 1, rotate: 0 }, animate: { scale: 1.05, rotate: [0, -7, 7, 0], transition: { rotate: { duration: 0.5, ease: "easeInOut" }, scale: { type: "spring", stiffness: 400, damping: 10 } } } as any }}>
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        </IconWrapper>
    );
};

export const AnimatedMessageSquareCheck = ({ isHovered, ...props }: AnimatedIconProps) => {
    const controls = useIconAnimation(isHovered);
    return (
        <IconWrapper controls={controls} {...props}>
            <path d="M22 17a2 2 0 0 1-2 2H6.828a2 2 0 0 0-1.414.586l-2.202 2.202A.7.7 0 0 1 2 21.286V5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2z" />
            <motion.path d="m9 11 2 2 4-4" style={{ transformOrigin: "center" }} variants={{ normal: { pathLength: 1, opacity: 1 }, animate: { pathLength: [0, 1], opacity: [0, 1], transition: { duration: 0.4, ease: "easeInOut" } } } as any} />
        </IconWrapper>
    );
};

export const AnimatedMessageSquareDashed = ({ isHovered, ...props }: AnimatedIconProps) => {
    const controls = useIconAnimation(isHovered);
    return (
        <IconWrapper controls={controls} {...props}>
            {["M14 3h1", "M14 17h1", "M10 17H7l-4 4v-7", "M9 3h1", "M19 3a2 2 0 0 1 2 2", "M3 9v1", "M21 9v1", "M21 14v1a2 2 0 0 1-2 2", "M5 3a2 2 0 0 0-2 2"].map((d, index) => (
                <motion.path key={d} d={d} variants={{ normal: { opacity: 1 }, animate: { opacity: [0, 1], transition: { delay: (index + 1) * 0.1, duration: 0.3 } } } as any} />
            ))}
        </IconWrapper>
    );
};

export const AnimatedMessageSquareMore = ({ isHovered, ...props }: AnimatedIconProps) => {
    const controls = useIconAnimation(isHovered);
    const dotVar = (delayFactor: number) => ({ normal: { opacity: 1 }, animate: { opacity: [1, 0, 0, 1, 1, 0, 0, 1], transition: { duration: 1.5, times: [0, 0.1, 0.1 + delayFactor * 0.1, 0.1 + delayFactor * 0.1 + 0.1, 0.5, 0.6, 0.6 + delayFactor * 0.1, 0.6 + delayFactor * 0.1 + 0.1] } } } as any);
    return (
        <IconWrapper controls={controls} {...props}>
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            <motion.path d="M8 10h.01" variants={dotVar(0)} />
            <motion.path d="M12 10h.01" variants={dotVar(1)} />
            <motion.path d="M16 10h.01" variants={dotVar(2)} />
        </IconWrapper>
    );
};

export const AnimatedMessageSquarePlus = ({ isHovered, ...props }: AnimatedIconProps) => {
    const controls = useIconAnimation(isHovered);
    return (
        <IconWrapper controls={controls} {...props}>
            <path d="M22 17a2 2 0 0 1-2 2H6.828a2 2 0 0 0-1.414.586l-2.202 2.202A.71.71 0 0 1 2 21.286V5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2z" />
            <motion.path d="M12 8v6" variants={{ normal: { pathLength: 1, opacity: 1 }, animate: { pathLength: [0, 1], opacity: [0, 1], transition: { duration: 0.4, ease: "easeInOut" } } } as any} />
            <motion.path d="M9 11h6" variants={{ normal: { pathLength: 1, opacity: 1 }, animate: { pathLength: [0, 1], opacity: [0, 1], transition: { duration: 0.4, ease: "easeInOut", delay: 0.2 } } } as any} />
        </IconWrapper>
    );
};

export const AnimatedMessageSquareX = ({ isHovered, ...props }: AnimatedIconProps) => {
    const controls = useIconAnimation(isHovered);
    return (
        <IconWrapper controls={controls} {...props}>
            <path d="M22 17a2 2 0 0 1-2 2H6.828a2 2 0 0 0-1.414.586l-2.202 2.202A.71.71 0 0 1 2 21.286V5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2z" />
            <motion.path d="m14.5 8.5-5 5" variants={{ normal: { pathLength: 1, opacity: 1 }, animate: { pathLength: [0, 1], opacity: [0, 1], transition: { duration: 0.4, ease: "easeInOut" } } } as any} />
            <motion.path d="m9.5 8.5 5 5" variants={{ normal: { pathLength: 1, opacity: 1 }, animate: { pathLength: [0, 1], opacity: [0, 1], transition: { duration: 0.4, ease: "easeInOut", delay: 0.2 } } } as any} />
        </IconWrapper>
    );
};

export const AnimatedMic = ({ isHovered, ...props }: AnimatedIconProps) => {
    const controls = useIconAnimation(isHovered);
    return (
        <IconWrapper controls={controls} {...props} style={{ overflow: "visible" }}>
            <path d="M12 19v3" />
            <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
            <motion.rect height="13" rx="3" width="6" x="9" y="2" variants={{ normal: { y: 0 }, animate: { y: [0, -3, 0, -2, 0], transition: { duration: 0.6, ease: "easeInOut" } } } as any} />
        </IconWrapper>
    );
};

export const AnimatedMicOff = ({ isHovered, ...props }: AnimatedIconProps) => {
    const controls = useIconAnimation(isHovered);
    return (
        <IconWrapper controls={controls} {...props}>
            <path d="M12 19v3" />
            <path d="M15 9.34V5a3 3 0 0 0-5.68-1.33" />
            <path d="M16.95 16.95A7 7 0 0 1 5 12v-2" />
            <path d="M18.89 13.23A7 7 0 0 0 19 12v-2" />
            <path d="M9 9v3a3 3 0 0 0 5.12 2.12" />
            <motion.path d="m2 2 20 20" variants={{ normal: { pathLength: 1, opacity: 1 }, animate: { pathLength: [0, 1], opacity: [0, 1], transition: { duration: 0.4, delay: 0.15 } } } as any} />
        </IconWrapper>
    );
};

export const AnimatedMinimize = ({ isHovered, ...props }: AnimatedIconProps) => {
    const controls = useIconAnimation(isHovered);
    const t = { type: "spring", stiffness: 250, damping: 25 } as any;
    return (
        <IconWrapper controls={controls} {...props}>
            <motion.path d="M8 3v3a2 2 0 0 1-2 2H3" variants={{ normal: { translateX: "0%", translateY: "0%" }, animate: { translateX: "2px", translateY: "2px", transition: t } }} />
            <motion.path d="M21 8h-3a2 2 0 0 1-2-2V3" variants={{ normal: { translateX: "0%", translateY: "0%" }, animate: { translateX: "-2px", translateY: "2px", transition: t } }} />
            <motion.path d="M3 16h3a2 2 0 0 1 2 2v3" variants={{ normal: { translateX: "0%", translateY: "0%" }, animate: { translateX: "2px", translateY: "-2px", transition: t } }} />
            <motion.path d="M16 21v-3a2 2 0 0 1 2-2h3" variants={{ normal: { translateX: "0%", translateY: "0%" }, animate: { translateX: "-2px", translateY: "-2px", transition: t } }} />
        </IconWrapper>
    );
};

export const AnimatedMonitorCheck = ({ isHovered, ...props }: AnimatedIconProps) => {
    const controls = useIconAnimation(isHovered);
    return (
        <IconWrapper controls={controls} {...props}>
            <rect height="14" rx="2" width="20" x="2" y="3" />
            <path d="M12 17v4" /><path d="M8 21h8" />
            <motion.path d="m9 10 2 2 4-4" style={{ transformOrigin: "center" }} variants={{ normal: { pathLength: 1, opacity: 1 }, animate: { pathLength: [0, 1], opacity: [0, 1], transition: { duration: 0.4, ease: "easeInOut" } } } as any} />
        </IconWrapper>
    );
};

export const AnimatedMoon = ({ isHovered, ...props }: AnimatedIconProps) => {
    const controls = useIconAnimation(isHovered);
    return (
        <IconWrapper controls={controls} {...props}>
            <motion.path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" variants={{ normal: { rotate: 0 }, animate: { rotate: [0, -10, 10, -5, 5, 0], transition: { duration: 1.2, ease: "easeInOut" } } } as any} />
        </IconWrapper>
    );
};

export const AnimatedNfc = ({ isHovered, ...props }: AnimatedIconProps) => {
    const controls = useIconAnimation(isHovered);
    const pVar = (delay: number) => ({
        normal: { opacity: 1 },
        animate: { opacity: [0, 1], transition: { type: "spring", stiffness: 300, damping: 20, delay } }
    } as any);

    return (
        <IconWrapper controls={controls} {...props}>
            <motion.path d="M6 8.32a7.43 7.43 0 0 1 0 7.36" variants={pVar(0)} />
            <motion.path d="M9.46 6.21a11.76 11.76 0 0 1 0 11.58" variants={pVar(0.1)} />
            <motion.path d="M12.91 4.1a15.91 15.91 0 0 1 .01 15.8" variants={pVar(0.2)} />
            <motion.path d="M16.37 2a20.16 20.16 0 0 1 0 20" variants={pVar(0.3)} />
        </IconWrapper>
    );
};

export const AnimatedPanelLeftClose = ({ isHovered, ...props }: AnimatedIconProps) => {
    const controls = useIconAnimation(isHovered);
    return (
        <IconWrapper controls={controls} {...props}>
            <rect height="18" rx="2" width="18" x="3" y="3" />
            <path d="M9 3v18" />
            <motion.path d="m16 15-3-3 3-3" variants={{ normal: { x: 0 }, animate: { x: [0, -1.5, 0], transition: { duration: 0.5, times: [0, 0.4, 1] } } } as any} />
        </IconWrapper>
    );
};

export const AnimatedPanelLeftOpen = ({ isHovered, ...props }: AnimatedIconProps) => {
    const controls = useIconAnimation(isHovered);
    return (
        <IconWrapper controls={controls} {...props}>
            <rect height="18" rx="2" width="18" x="3" y="3" />
            <path d="M9 3v18" />
            <motion.path d="m14 9 3 3-3 3" variants={{ normal: { x: 0 }, animate: { x: [0, 1.5, 0], transition: { duration: 0.5, times: [0, 0.4, 1] } } } as any} />
        </IconWrapper>
    );
};

export const AnimatedPanelRightOpen = ({ isHovered, ...props }: AnimatedIconProps) => {
    const controls = useIconAnimation(isHovered);
    return (
        <IconWrapper controls={controls} {...props}>
            <rect height="18" rx="2" width="18" x="3" y="3" />
            <path d="M15 3v18" />
            <motion.path d="m10 15-3-3 3-3" variants={{ normal: { x: 0 }, animate: { x: [0, -1.5, 0], transition: { duration: 0.5, times: [0, 0.4, 1] } } } as any} />
        </IconWrapper>
    );
};

export const AnimatedPartyPopper = ({ isHovered, ...props }: AnimatedIconProps) => {
    const controls = useIconAnimation(isHovered);
    return (
        <IconWrapper controls={controls} {...props}>
            <motion.path d="M5.8 11.3 2 22l10.7-3.79" variants={{ normal: { translateX: 0, translateY: 0 }, animate: { translateX: [-1.5, 0], translateY: [1.5, 0], transition: { velocity: 0.3 } } } as any} />
            <motion.path d="M11 13c1.93 1.93 2.83 4.17 2 5-.83.83-3.07-.07-5-2-1.93-1.93-2.83-4.17-2-5 .83-.83 3.07.07 5 2Z" variants={{ normal: { translateX: 0, translateY: 0 }, animate: { translateX: [-1.5, 0], translateY: [1.5, 0], transition: { velocity: 0.3 } } } as any} />
            {["M4 3h.01", "M22 8h.01", "M15 2h.01", "M22 20h.01"].map((d, i) => (
                <motion.path key={i} d={d} variants={{ normal: { opacity: 1, scale: 1, translateX: 0, translateY: 0 }, animate: { opacity: [0, 1], translateX: [-5, 0], translateY: [5, 0], scale: [0.5, 0.8, 1, 1.1, 1], transition: { duration: 0.7 } } } as any} />
            ))}
            {["m14 10 1.21-1.06c0.16-0.84 0.9-1.44 1.76-1.44h0.38c0.88 0 1.55-0.77 1.45-1.63a2.9 2.9 0 0 1 1.96-3.12L22 2", "M17 15h0.77c0.71 0 1.32-0.52 1.43-1.22c0.16-0.91 1.12-1.45 1.98-1.11L22 13", "M9 7V6.23c0-0.71 0.52-1.33 1.22-1.43c0.91-0.16 1.45-1.12 1.11-1.98L11 2"].map((d, i) => (
                <motion.path key={i} d={d} variants={{ normal: { opacity: 1, pathLength: 1, scale: 1, translateX: 0, translateY: 0 }, animate: { opacity: [0, 1], scale: [0.3, 0.8, 1, 1.1, 1], pathLength: [0, 0.5, 1], translateX: [-5, 0], translateY: [5, 0], transition: { duration: 0.7, velocity: 0.3 } } } as any} />
            ))}
        </IconWrapper>
    );
};

export const AnimatedPause = ({ isHovered, ...props }: AnimatedIconProps) => {
    const controls = useIconAnimation(isHovered);
    const t = { times: [0, 0.2, 0.5, 1], duration: 0.5, stiffness: 260, damping: 20 } as any;
    return (
        <IconWrapper controls={controls} {...props}>
            <motion.rect height="16" rx="1" width="4" x="6" y="4" variants={{ normal: { y: 0 }, animate: { y: [0, 2, 0, 0], transition: t } } as any} />
            <motion.rect height="16" rx="1" width="4" x="14" y="4" variants={{ normal: { y: 0 }, animate: { y: [0, 0, 2, 0], transition: t } } as any} />
        </IconWrapper>
    );
};

export const AnimatedPlay = ({ isHovered, ...props }: AnimatedIconProps) => {
    const controls = useIconAnimation(isHovered);
    return (
        <IconWrapper controls={controls} {...props}>
            <motion.polygon points="6 3 20 12 6 21 6 3" variants={{ normal: { x: 0, rotate: 0 }, animate: { x: [0, -1, 2, 0], rotate: [0, -10, 0, 0], transition: { duration: 0.5, times: [0, 0.2, 0.5, 1], stiffness: 260, damping: 20 } } } as any} />
        </IconWrapper>
    );
};

export const AnimatedPlugZap = ({ isHovered, ...props }: AnimatedIconProps) => {
    const controls = useIconAnimation(isHovered);
    return (
        <IconWrapper controls={controls} {...props}>
            <path d="M6.3 20.3a2.4 2.4 0 0 0 3.4 0L12 18l-6-6-2.3 2.3a2.4 2.4 0 0 0 0 3.4Z" />
            <path d="m2 22 3-3" /><path d="M7.5 13.5 10 11" /><path d="M10.5 16.5 13 14" />
            <motion.path d="m18 3-4 4h6l-4 4" variants={{ normal: { opacity: 1 }, animate: { opacity: [1, 0.4, 1], transition: { duration: 1, repeat: Infinity, ease: "easeInOut" } } } as any} />
        </IconWrapper>
    );
};

export const AnimatedRadio = ({ isHovered, ...props }: AnimatedIconProps) => {
    const controls = useIconAnimation(isHovered);
    return (
        <IconWrapper controls={controls} {...props}>
            <motion.path d="M4.9 19.1C1 15.2 1 8.8 4.9 4.9" variants={{ normal: { opacity: 1 }, animate: { opacity: [0, 1], transition: { type: "spring", stiffness: 300, damping: 20, delay: 0.1 } } } as any} />
            <motion.path d="M7.8 16.2c-2.3-2.3-2.3-6.1 0-8.5" variants={{ normal: { opacity: 1 }, animate: { opacity: [0, 1], transition: { type: "spring", stiffness: 300, damping: 20, delay: 0 } } } as any} />
            <circle cx="12" cy="12" r="2" />
            <motion.path d="M16.2 7.8c2.3 2.3 2.3 6.1 0 8.5" variants={{ normal: { opacity: 1 }, animate: { opacity: [0, 1], transition: { type: "spring", stiffness: 300, damping: 20, delay: 0 } } } as any} />
            <motion.path d="M19.1 4.9C23 8.8 23 15.1 19.1 19" variants={{ normal: { opacity: 1 }, animate: { opacity: [0, 1], transition: { type: "spring", stiffness: 300, damping: 20, delay: 0.1 } } } as any} />
        </IconWrapper>
    );
};

export const AnimatedRadioTower = ({ isHovered, ...props }: AnimatedIconProps) => {
    const controls = useIconAnimation(isHovered);
    return (
        <IconWrapper controls={controls} {...props}>
            <motion.path d="M4.9 16.1C1 12.2 1 5.8 4.9 1.9" variants={{ normal: { opacity: 1 }, animate: { opacity: [0, 1], transition: { type: "spring", stiffness: 300, damping: 20, delay: 0.1 } } } as any} />
            <motion.path d="M7.8 4.7a6.14 6.14 0 0 0-.8 7.5" variants={{ normal: { opacity: 1 }, animate: { opacity: [0, 1], transition: { type: "spring", stiffness: 300, damping: 20, delay: 0 } } } as any} />
            <circle cx="12" cy="9" r="2" />
            <motion.path d="M16.2 4.8c2 2 2.26 5.11.8 7.47" variants={{ normal: { opacity: 1 }, animate: { opacity: [0, 1], transition: { type: "spring", stiffness: 300, damping: 20, delay: 0 } } } as any} />
            <motion.path d="M19.1 1.9a9.96 9.96 0 0 1 0 14.1" variants={{ normal: { opacity: 1 }, animate: { opacity: [0, 1], transition: { type: "spring", stiffness: 300, damping: 20, delay: 0.1 } } } as any} />
            <path d="M9.5 18h5" /><path d="m8 22 4-11 4 11" />
        </IconWrapper>
    );
};

export const AnimatedRedo = ({ isHovered, ...props }: AnimatedIconProps) => {
    const controls = useIconAnimation(isHovered);
    const cb = [0.25, 0.1, 0.25, 1];
    return (
        <IconWrapper controls={controls} {...props}>
            <motion.path d="M21 7v6h-6" variants={{ normal: { translateX: 0, translateY: 0, rotate: 0 }, animate: { translateX: [0, -2.1, 0], translateY: [0, -1.4, 0], rotate: [0, -12, 0], transition: { duration: 0.6, ease: cb } } } as any} />
            <motion.path d="M3 17a9 9 0 0 1 9-9 9 9 0 0 1 6 2.3l3 2.7" variants={{ normal: { pathLength: 1 }, animate: { pathLength: [1, 0.8, 1], transition: { duration: 0.6, ease: cb } } } as any} />
        </IconWrapper>
    );
};

export const AnimatedRedoDot = ({ isHovered, ...props }: AnimatedIconProps) => {
    const controls = useIconAnimation(isHovered);
    const cb = [0.25, 0.1, 0.25, 1];
    return (
        <IconWrapper controls={controls} {...props}>
            <motion.path d="M21 7v6h-6" variants={{ normal: { translateX: 0, translateY: 0, rotate: 0 }, animate: { translateX: [0, -2.1, 0], translateY: [0, -1.4, 0], rotate: [0, -12, 0], transition: { duration: 0.6, ease: cb } } } as any} />
            <motion.path d="M3 17a9 9 0 0 1 9-9 9 9 0 0 1 6 2.3l3 2.7" variants={{ normal: { pathLength: 1 }, animate: { pathLength: [1, 0.8, 1], transition: { duration: 0.6, ease: cb } } } as any} />
            <motion.circle cx="12" cy="17" r="1" variants={{ normal: { scale: 1 }, animate: { scale: [1, 1.2, 1], transition: { duration: 0.6, ease: cb } } } as any} />
        </IconWrapper>
    );
};

export const AnimatedRefreshCCW = ({ isHovered, ...props }: AnimatedIconProps) => {
    const controls = useIconAnimation(isHovered);
    return (
        <IconWrapper controls={controls} {...props}>
            <motion.g variants={{ normal: { rotate: "0deg" }, animate: { rotate: "-50deg", transition: { type: "spring", stiffness: 250, damping: 25 } } } as any}>
                <path d="M3 2v6h6" /><path d="M21 12A9 9 0 0 0 6 5.3L3 8" /><path d="M21 22v-6h-6" /><path d="M3 12a9 9 0 0 0 15 6.7l3-2.7" />
            </motion.g>
        </IconWrapper>
    );
};

export const AnimatedRefreshCCWDot = ({ isHovered, ...props }: AnimatedIconProps) => {
    const controls = useIconAnimation(isHovered);
    return (
        <IconWrapper controls={controls} {...props}>
            <motion.g variants={{ normal: { rotate: "0deg" }, animate: { rotate: "-50deg", transition: { type: "spring", stiffness: 250, damping: 25 } } } as any}>
                <path d="M3 2v6h6" /><path d="M21 12A9 9 0 0 0 6 5.3L3 8" /><path d="M21 22v-6h-6" /><path d="M3 12a9 9 0 0 0 15 6.7l3-2.7" />
            </motion.g>
            <circle cx="12" cy="12" r="1" />
        </IconWrapper>
    );
};

export const AnimatedRefreshCW = ({ isHovered, ...props }: AnimatedIconProps) => {
    const controls = useIconAnimation(isHovered);
    return (
        <IconWrapper controls={controls} {...props}>
            <motion.g style={{ transformOrigin: "12px 12px" }} variants={{ normal: { rotate: "0deg" }, animate: { rotate: "50deg", transition: { type: "spring", stiffness: 250, damping: 25 } } } as any}>
                <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" /><path d="M21 3v5h-5" /><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" /><path d="M8 16H3v5" />
            </motion.g>
        </IconWrapper>
    );
};

export const AnimatedRefreshCWOff = ({ isHovered, ...props }: AnimatedIconProps) => {
    const controls = useIconAnimation(isHovered);
    return (
        <IconWrapper controls={controls} {...props}>
            <motion.g variants={{ normal: { x: 0 }, animate: { x: [-3, 3, -3, 3, 0], transition: { type: "spring", stiffness: 500, damping: 20, duration: 0.4 } } } as any}>
                <path d="M21 8L18.74 5.74A9.75 9.75 0 0 0 12 3C11 3 10.03 3.16 9.13 3.47" />
                <path d="M8 16H3v5" /><path d="M3 12C3 9.51 4 7.26 5.64 5.64" />
                <path d="m3 16 2.26 2.26A9.75 9.75 0 0 0 12 21c2.49 0 4.74-1 6.36-2.64" />
                <path d="M21 12c0 1-.16 1.97-.47 2.87" /><path d="M21 3v5h-5" /><path d="M22 22 2 2" />
            </motion.g>
        </IconWrapper>
    );
};

export const AnimatedRocket = ({ isHovered, ...props }: AnimatedIconProps) => {
    const controls = useIconAnimation(isHovered);
    return (
        <IconWrapper controls={controls} {...props}>
            <motion.g variants={{
                normal: { x: 0, y: 0 },
                animate: {
                    x: [0, 0, -3, 2, -2, 1, -1, 0],
                    y: [0, -3, 0, -2, -3, -1, -2, 0],
                    transition: { duration: 1, ease: "easeInOut", times: [0, 0.15, 0.3, 0.45, 0.6, 0.75, 0.9, 1] }
                }
            } as any}>
                <path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" />
                <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0" />
                <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" />
                <motion.path variants={{
                    normal: { d: "M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" },
                    animate: {
                        d: [
                            "M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z",
                            "M4.5 16.5c-1.5 1.26-3 5.5-3 5.5s4.74-1 6-2.5c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z",
                            "M4.5 16.5c-1.5 1.26-2.2 4.8-2.2 4.8s3.94-0.3 5.2-1.8c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z",
                            "M4.5 16.5c-1.5 1.26-2.8 5.2-2.8 5.2s4.54-0.7 5.8-2.2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z",
                            "M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"
                        ],
                        transition: { duration: 1, ease: [0.4, 0, 0.2, 1], times: [0, 0.2, 0.5, 0.8, 1] }
                    }
                } as any} />
            </motion.g>
        </IconWrapper>
    );
};

export const AnimatedScanFace = ({ isHovered, ...props }: AnimatedIconProps) => {
    const controls = useIconAnimation(isHovered);
    const cornerVar = {
        normal: { scale: 1, rotate: 0, opacity: 1 },
        animate: {
            scale: [1, 1.2, 1],
            rotate: [0, 45, 0],
            opacity: [1, 0, 1],
            transition: { type: "spring", stiffness: 200, damping: 20 }
        }
    } as any;

    return (
        <IconWrapper controls={controls} {...props}>
            <motion.g variants={{ normal: { scale: 1 }, animate: { scale: [1, 0.9, 1], transition: { type: "spring", stiffness: 200, damping: 20 } } } as any}>
                <motion.path d="M3 7V5a2 2 0 0 1 2-2h2" variants={cornerVar} />
                <motion.path d="M17 3h2a2 2 0 0 1 2 2v2" variants={cornerVar} />
                <motion.path d="M21 17v2a2 2 0 0 1-2 2h-2" variants={cornerVar} />
                <motion.path d="M7 21H5a2 2 0 0 1-2-2v-2" variants={cornerVar} />
                <motion.path d="M8 14s1.5 2 4 2 4-2 4-2" variants={{ normal: { scale: 1, opacity: 1 }, animate: { scale: [1, 0.8, 1], opacity: [1, 0, 1], transition: { duration: 0.6, delay: 0.1 } } } as any} />
                <line x1="9" x2="9.01" y1="9" y2="9" />
                <line x1="15" x2="15.01" y1="9" y2="9" />
            </motion.g>
        </IconWrapper>
    );
};

export const AnimatedScanText = ({ isHovered, ...props }: AnimatedIconProps) => {
    const controls = useIconAnimation(isHovered);
    const lineVar = (d: number) => ({
        normal: { pathLength: 1, opacity: 1 },
        animate: {
            pathLength: [0, 1],
            opacity: [0, 1],
            transition: { duration: 0.4, delay: d, ease: "easeOut" }
        }
    } as any);

    return (
        <IconWrapper controls={controls} {...props}>
            <path d="M3 7V5a2 2 0 0 1 2-2h2" />
            <path d="M17 3h2a2 2 0 0 1 2 2v2" />
            <path d="M21 17v2a2 2 0 0 1-2 2h-2" />
            <path d="M7 21H5a2 2 0 0 1-2-2v-2" />
            <motion.path d="M7 8h8" variants={lineVar(0)} />
            <motion.path d="M7 12h10" variants={lineVar(0.1)} />
            <motion.path d="M7 16h6" variants={lineVar(0.2)} />
        </IconWrapper>
    );
};
export const AnimatedSearch = ({ isHovered, ...props }: AnimatedIconProps) => {
    const controls = useIconAnimation(isHovered);
    return (
        <IconWrapper controls={controls} {...props}>
            <motion.g variants={{ normal: { x: 0, y: 0 }, animate: { x: [0, 0, -3, 0], y: [0, -4, 0, 0], transition: { duration: 1, bounce: 0.3 } } } as any}>
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.3-4.3" />
            </motion.g>
        </IconWrapper>
    );
};

export const AnimatedSend = ({ isHovered, ...props }: AnimatedIconProps) => {
    const controls = useIconAnimation(isHovered);
    return (
        <IconWrapper controls={controls} {...props} className="overflow-visible">
            <motion.g variants={{ normal: { x: 0, y: 0, scale: 1 }, animate: { x: 3, y: -3, scale: 0.8, transition: { duration: 0.5 } } } as any}>
                <path d="M14.536 21.686a.5.5 0 0 0 .937-.024l6.5-19a.496.496 0 0 0-.635-.635l-19 6.5a.5.5 0 0 0-.024.937l7.93 3.18a2 2 0 0 1 1.112 1.11z" />
                <path d="m21.854 2.147-10.94 10.939" />
            </motion.g>
            <motion.path d="M -3 28 C -0.5 26.8 1.6 24.6 3.3 22 C 4.8 19.7 5.2 17.6 4.2 16.1 C 3.2 14.7 1.4 14.5 0.3 15.8 C -0.9 17.2 -0.6 19.4 1.2 20.4 C 3.4 21.5 6.4 19.4 9 15.8" fill="none" stroke="currentColor" strokeDasharray="2 2" strokeWidth="1" variants={{ normal: { pathLength: 0, opacity: 0, translateX: -3, translateY: 3, transition: { duration: 0.3 } }, animate: { pathLength: 1, opacity: 1, translateX: 0, translateY: 0, transition: { duration: 0.55, delay: 0.1 } } } as any} />
        </IconWrapper>
    );
};

export const AnimatedShieldCheck = ({ isHovered, ...props }: AnimatedIconProps) => {
    const controls = useIconAnimation(isHovered);
    return (
        <IconWrapper controls={controls} {...props}>
            <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" />
            <motion.path d="m9 12 2 2 4-4" variants={{ normal: { opacity: 1, pathLength: 1, scale: 1 }, animate: { opacity: [0, 1], pathLength: [0, 1], scale: [0.5, 1], transition: { duration: 0.4 } } } as any} />
        </IconWrapper>
    );
};

export const AnimatedShrink = ({ isHovered, ...props }: AnimatedIconProps) => {
    const controls = useIconAnimation(isHovered);
    const t = { type: "spring", stiffness: 250, damping: 25 } as any;
    return (
        <IconWrapper controls={controls} {...props}>
            <motion.path d="M9 4.2V9m0 0H4.2M9 9 3 3" variants={{ normal: { translateX: "0%", translateY: "0%" }, animate: { translateX: "1px", translateY: "1px", transition: t } }} />
            <motion.path d="M15 4.2V9m0 0h4.8M15 9l6-6" variants={{ normal: { translateX: "0%", translateY: "0%" }, animate: { translateX: "-1px", translateY: "1px", transition: t } }} />
            <motion.path d="M9 19.8V15m0 0H4.2M9 15l-6 6" variants={{ normal: { translateX: "0%", translateY: "0%" }, animate: { translateX: "1px", translateY: "-1px", transition: t } }} />
            <motion.path d="m15 15 6 6m-6-6v4.8m0-4.8h4.8" variants={{ normal: { translateX: "0%", translateY: "0%" }, animate: { translateX: "-1px", translateY: "-1px", transition: t } }} />
        </IconWrapper>
    );
};

export const AnimatedSmartphoneCharging = ({ isHovered, ...props }: AnimatedIconProps) => {
    const controls = useIconAnimation(isHovered);
    return (
        <IconWrapper controls={controls} {...props}>
            <rect height="20" rx="2" ry="2" width="14" x="5" y="2" />
            <motion.path d="M12.667 8 10 12h4l-2.667 4" variants={{ normal: { opacity: 1 }, animate: { opacity: [1, 0.4, 1], transition: { duration: 1, repeat: Infinity, ease: "easeInOut" } } } as any} />
        </IconWrapper>
    );
};

export const AnimatedSmartphoneNfc = ({ isHovered, ...props }: AnimatedIconProps) => {
    const controls = useIconAnimation(isHovered);
    const lineVar = (d: number) => ({
        normal: { opacity: 1 },
        animate: { opacity: [0, 1], transition: { type: "spring", stiffness: 300, damping: 20, delay: d } }
    } as any);

    return (
        <IconWrapper controls={controls} {...props}>
            <rect height="12" rx="1" width="7" x="2" y="6" />
            <motion.path d="M13 8.32a7.43 7.43 0 0 1 0 7.36" variants={lineVar(0)} />
            <motion.path d="M16.46 6.21a11.76 11.76 0 0 1 0 11.58" variants={lineVar(0.1)} />
            <motion.path d="M19.91 4.1a15.91 15.91 0 0 1 .01 15.8" variants={lineVar(0.2)} />
        </IconWrapper>
    );
};

export const AnimatedSnowflake = ({ isHovered, ...props }: AnimatedIconProps) => {
    const controls = useIconAnimation(isHovered);
    return (
        <IconWrapper controls={controls} {...props}>
            <motion.g style={{ transformOrigin: "center" }} variants={{ normal: { rotate: 0 }, animate: { rotate: [0, -5, 5, -5, 5, 0], transition: { duration: 0.4, times: [0, 0.2, 0.4, 0.6, 0.8, 1] } } } as any}>
                <path d="m10 20-1.25-2.5L6 18" /><path d="M10 4 8.75 6.5 6 6" />
                <path d="m14 20 1.25-2.5L18 18" /><path d="m14 4 1.25 2.5L18 6" />
                <path d="m17 21-3-6h-4" /><path d="m17 3-3 6 1.5 3" />
                <path d="M2 12h6.5L10 9" /><path d="m20 10-1.5 2 1.5 2" />
                <path d="M22 12h-6.5L14 15" /><path d="m4 10 1.5 2L4 14" />
                <path d="m7 21 3-6-1.5-3" /><path d="m7 3 3 6h4" />
            </motion.g>
        </IconWrapper>
    );
};

export const AnimatedSparkles = ({ isHovered, ...props }: AnimatedIconProps) => {
    const controls = useIconAnimation(isHovered);
    return (
        <IconWrapper controls={controls} {...props}>
            <motion.path
                d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z"
                variants={{
                    normal: { y: 0, fill: "none" },
                    animate: { y: [0, -1, 0, 0], fill: "currentColor", transition: { duration: 1, bounce: 0.3 } }
                } as any}
            />
            <motion.g
                variants={{
                    normal: { opacity: 1, x: 0, y: 0 },
                    animate: { opacity: [0, 1, 0, 0, 0, 0, 1], transition: { duration: 2, type: "spring", stiffness: 70, damping: 10, mass: 0.4, delay: 1 } }
                } as any}
            >
                <path d="M20 3v4" />
                <path d="M22 5h-4" />
                <path d="M4 17v2" />
                <path d="M5 18H3" />
            </motion.g>
        </IconWrapper>
    );
};

export const AnimatedSquareActivity = ({ isHovered, ...props }: AnimatedIconProps) => {
    const controls = useIconAnimation(isHovered);
    return (
        <IconWrapper controls={controls} {...props}>
            <rect height="18" rx="2" width="18" x="3" y="3" />
            <motion.path d="M17 12h-2l-2 5-2-10-2 5H7" variants={{ normal: { opacity: 1, pathLength: 1, pathOffset: 0 }, animate: { opacity: [0, 1], pathLength: [0, 1], pathOffset: [1, 0], transition: { duration: 0.6, ease: "linear" } } } as any} />
        </IconWrapper>
    );
};

export const AnimatedSquareArrowDown = ({ isHovered, ...props }: AnimatedIconProps) => {
    const controls = useIconAnimation(isHovered);
    return (
        <IconWrapper controls={controls} {...props}>
            <rect height="18" rx="2" width="18" x="3" y="3" />
            <motion.path d="m8 12 4 4 4-4" variants={{ normal: { translateY: 0, opacity: 1 }, animate: { translateY: [0, -3, 0], transition: { duration: 0.4 } } } as any} />
            <motion.path d="M12 8v8" variants={{ normal: { d: "M12 8v8", opacity: 1 }, animate: { d: ["M12 8v8", "M12 8v5", "M12 8v8"], transition: { duration: 0.4 } } } as any} />
        </IconWrapper>
    );
};

export const AnimatedSquareArrowLeft = ({ isHovered, ...props }: AnimatedIconProps) => {
    const controls = useIconAnimation(isHovered);
    return (
        <IconWrapper controls={controls} {...props}>
            <rect height="18" rx="2" width="18" x="3" y="3" />
            <motion.path d="m12 8-4 4 4 4" variants={{ normal: { translateX: 0, opacity: 1 }, animate: { translateX: [0, 3, 0], transition: { duration: 0.4 } } } as any} />
            <motion.path d="M16 12H8" variants={{ normal: { d: "M16 12H8", opacity: 1 }, animate: { d: ["M16 12H8", "M16 12H13", "M16 12H8"], transition: { duration: 0.4 } } } as any} />
        </IconWrapper>
    );
};

export const AnimatedSquareArrowRight = ({ isHovered, ...props }: AnimatedIconProps) => {
    const controls = useIconAnimation(isHovered);
    return (
        <IconWrapper controls={controls} {...props}>
            <rect height="18" rx="2" width="18" x="3" y="3" />
            <motion.path d="M8 12h8" variants={{ normal: { d: "M8 12h8", opacity: 1 }, animate: { d: ["M8 12h8", "M8 12h5", "M8 12h8"], transition: { duration: 0.4 } } } as any} />
            <motion.path d="m12 8 4 4-4 4" variants={{ normal: { translateX: 0, opacity: 1 }, animate: { translateX: [0, -3, 0], transition: { duration: 0.4 } } } as any} />
        </IconWrapper>
    );
};

export const AnimatedSquareArrowUp = ({ isHovered, ...props }: AnimatedIconProps) => {
    const controls = useIconAnimation(isHovered);
    return (
        <IconWrapper controls={controls} {...props}>
            <rect height="18" rx="2" width="18" x="3" y="3" />
            <motion.path d="m16 12-4-4-4 4" variants={{ normal: { translateY: 0, opacity: 1 }, animate: { translateY: [0, 3, 0], transition: { duration: 0.4 } } } as any} />
            <motion.path d="M12 16V8" variants={{ normal: { d: "M12 16V8", opacity: 1 }, animate: { d: ["M12 16V8", "M12 16V13", "M12 16V8"], transition: { duration: 0.4 } } } as any} />
        </IconWrapper>
    );
};

export const AnimatedSquareChevronDown = ({ isHovered, ...props }: AnimatedIconProps) => {
    const controls = useIconAnimation(isHovered);
    return (
        <IconWrapper controls={controls} {...props}>
            <rect height="18" rx="2" width="18" x="3" y="3" />
            <motion.path d="m16 10-4 4-4-4" variants={{ normal: { y: 0 }, animate: { y: [0, 2, 0], transition: { duration: 0.5, times: [0, 0.4, 1] } } } as any} />
        </IconWrapper>
    );
};

export const AnimatedSquareChevronLeft = ({ isHovered, ...props }: AnimatedIconProps) => {
    const controls = useIconAnimation(isHovered);
    return (
        <IconWrapper controls={controls} {...props}>
            <rect height="18" rx="2" width="18" x="3" y="3" />
            <motion.path d="m14 16-4-4 4-4" variants={{ normal: { x: 0 }, animate: { x: [0, -2, 0], transition: { duration: 0.5, times: [0, 0.4, 1] } } } as any} />
        </IconWrapper>
    );
};

export const AnimatedSquareChevronRight = ({ isHovered, ...props }: AnimatedIconProps) => {
    const controls = useIconAnimation(isHovered);
    const t = { times: [0, 0.4, 1], duration: 0.5 } as any;
    return (
        <IconWrapper controls={controls} {...props}>
            <rect height="18" rx="2" width="18" x="3" y="3" />
            <motion.path d="m10 8 4 4-4 4" variants={{ normal: { x: 0 }, animate: { x: [0, 2, 0], transition: t } }} />
        </IconWrapper>
    );
};

export const AnimatedSquareChevronUp = ({ isHovered, ...props }: AnimatedIconProps) => {
    const controls = useIconAnimation(isHovered);
    const t = { times: [0, 0.4, 1], duration: 0.5 } as any;
    return (
        <IconWrapper controls={controls} {...props}>
            <rect height="18" rx="2" width="18" x="3" y="3" />
            <motion.path d="m8 14 4-4 4 4" variants={{ normal: { y: 0 }, animate: { y: [0, -2, 0], transition: t } }} />
        </IconWrapper>
    );
};

export const AnimatedSquarePen = ({ isHovered, ...props }: AnimatedIconProps) => {
    const controls = useIconAnimation(isHovered);
    return (
        <IconWrapper controls={controls} {...props} style={{ overflow: "visible" }}>
            <path d="M12 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
            <motion.path d="M18.375 2.625a1 1 0 0 1 3 3l-9.013 9.014a2 2 0 0 1-.853.505l-2.873.84a.5.5 0 0 1-.62-.62l.84-2.873a2 2 0 0 1 .506-.852z" variants={{ normal: { rotate: 0, x: 0, y: 0 }, animate: { rotate: [-0.5, 0.5, -0.5], x: [0, -1, 1.5, 0], y: [0, 1.5, -1, 0], transition: { duration: 0.5, repeat: 1, ease: "easeInOut" } } } as any} />
        </IconWrapper>
    );
};

export const AnimatedSquareStack = ({ isHovered, ...props }: AnimatedIconProps) => {
    const controls = useIconAnimation(isHovered);
    return (
        <IconWrapper controls={controls} {...props}>
            <motion.path d="M4 10c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h4c1.1 0 2 .9 2 2" variants={{ normal: { scale: 1 }, animate: { scale: [1, 0.9, 1], transition: { delay: 0.3, duration: 0.4 } } } as any} />
            <motion.path d="M10 16c-1.1 0-2-.9-2-2v-4c0-1.1.9-2 2-2h4c1.1 0 2 .9 2 2" variants={{ normal: { scale: 1 }, animate: { scale: [1, 0.9, 1], transition: { delay: 0.2, duration: 0.2 } } } as any} />
            <motion.rect height="8" rx="2" width="8" x="14" y="14" variants={{ normal: { scale: 1 }, animate: { scale: [1, 0.8, 1], transition: { duration: 0.4 } } } as any} />
        </IconWrapper>
    );
};

export const AnimatedStethoscope = ({ isHovered, ...props }: AnimatedIconProps) => {
    const controls = useIconAnimation(isHovered);
    const lineVar = (delay: number) => ({ normal: { pathLength: 1, pathOffset: 0, opacity: 1, transition: { delay: 0 } }, animate: { pathOffset: [1, 0], pathLength: [0, 1], opacity: [0, 1], transition: { duration: 0.25, delay } } } as any);
    return (
        <IconWrapper controls={controls} {...props}>
            <motion.path d="M11 2v2" variants={lineVar(0.6)} />
            <motion.path d="M5 2v2" variants={lineVar(0.6)} />
            <motion.path d="M5 3H4a2 2 0 0 0-2 2v4a6 6 0 0 0 12 0V5a2 2 0 0 0-2-2h-1" variants={lineVar(0.6)} />
            <motion.path d="M8 15a6 6 0 0 0 12 0v-3" variants={lineVar(0.35)} />
            <motion.circle cx="20" cy="10" r="2" variants={{ normal: { pathLength: 1, opacity: 1 }, animate: { pathLength: [0, 1], opacity: [0, 1], transition: { duration: 0.25, delay: 0.1 } } } as any} />
        </IconWrapper>
    );
};

export const AnimatedSunDim = ({ isHovered, ...props }: AnimatedIconProps) => {
    const controls = useIconAnimation(isHovered);
    return (
        <IconWrapper controls={controls} {...props}>
            <circle cx="12" cy="12" r="4" />
            {["M12 4h.01", "M20 12h.01", "M12 20h.01", "M4 12h.01", "M17.657 6.343h.01", "M17.657 17.657h.01", "M6.343 17.657h.01", "M6.343 6.343h.01"].map((d, index) => (
                <motion.path key={d} d={d} variants={{ normal: { opacity: 1 }, animate: { opacity: [0, 1], transition: { delay: (index + 1) * 0.1, duration: 0.3 } } } as any} />
            ))}
        </IconWrapper>
    );
};

export const AnimatedSunMedium = ({ isHovered, ...props }: AnimatedIconProps) => {
    const controls = useIconAnimation(isHovered);
    return (
        <IconWrapper controls={controls} {...props}>
            <circle cx="12" cy="12" r="4" />
            {["M12 3v1", "M12 20v1", "M3 12h1", "M20 12h1", "m18.364 5.636-.707.707", "m6.343 17.657-.707.707", "m5.636 5.636.707.707", "m17.657 17.657.707.707"].map((d, index) => (
                <motion.path key={d} d={d} variants={{ normal: { opacity: 1 }, animate: { opacity: [0, 1], transition: { delay: (index + 1) * 0.1, duration: 0.3 } } } as any} />
            ))}
        </IconWrapper>
    );
};

export const AnimatedSunset = ({ isHovered, ...props }: AnimatedIconProps) => {
    const controls = useIconAnimation(isHovered);
    return (
        <IconWrapper controls={controls} {...props}>
            <motion.g variants={{ normal: { y: 0 }, animate: { y: [0, 1, 0] } }}>
                <path d="M12 10V2" /><path d="m16 6-4 4-4-4" />
            </motion.g>
            {["m4.93 10.93 1.41 1.41", "M2 18h2", "M20 18h2", "m19.07 10.93-1.41 1.41", "M22 22H2"].map((d, index) => (
                <motion.path key={d} d={d} variants={{ normal: { opacity: 1 }, animate: { opacity: [0, 1], transition: { delay: (index + 1) * 0.1, duration: 0.3 } } } as any} />
            ))}
            <path d="M16 18a4 4 0 0 0-8 0" />
        </IconWrapper>
    );
};

export const AnimatedTelescope = ({ isHovered, ...props }: AnimatedIconProps) => {
    const controls = useIconAnimation(isHovered);
    return (
        <IconWrapper controls={controls} {...props}>
            <motion.g style={{ transformOrigin: "12px 13px" }} variants={{ normal: { rotate: 0, transition: { duration: 0.6, ease: "easeInOut" } }, animate: { rotate: -15, transition: { duration: 0.8, ease: "easeInOut" } } } as any}>
                <path d="m10.065 12.493-6.18 1.318a.934.934 0 0 1-1.108-.702l-.537-2.15a1.07 1.07 0 0 1 .691-1.265l13.504-4.44" />
                <path d="m13.56 11.747 4.332-.924" />
                <path d="M16.485 5.94a2 2 0 0 1 1.455-2.425l1.09-.272a1 1 0 0 1 1.212.727l1.515 6.06a1 1 0 0 1-.727 1.213l-1.09.272a2 2 0 0 1-2.425-1.455z" />
                <path d="m6.158 8.633 1.114 4.456" />
            </motion.g>
            <path d="m16 21-3.105-6.21" /><path d="m8 21 3.105-6.21" />
            <circle cx="12" cy="13" r="2" />
        </IconWrapper>
    );
};

export const AnimatedTerminal = ({ isHovered, ...props }: AnimatedIconProps) => {
    const controls = useIconAnimation(isHovered);
    return (
        <IconWrapper controls={controls} {...props}>
            <polyline points="4 17 10 11 4 5" />
            <motion.line x1="12" x2="20" y1="19" y2="19" variants={{ normal: { opacity: 1 }, animate: { opacity: [1, 0, 1], transition: { duration: 0.8, repeat: Infinity, ease: "linear" } } } as any} />
        </IconWrapper>
    );
};

export const AnimatedThermometer = ({ isHovered, ...props }: AnimatedIconProps) => {
    const controls = useIconAnimation(isHovered);
    return (
        <IconWrapper controls={controls} {...props}>
            <motion.path d="M14 4v10.54a4 4 0 1 1-4 0V4a2 2 0 0 1 4 0Z" style={{ transformOrigin: "center" }} variants={{ normal: { rotate: 0 }, animate: { rotate: [0, -5, 5, -5, 5, 0], transition: { duration: 0.4, times: [0, 0.2, 0.4, 0.6, 0.8, 1] } } } as any} />
        </IconWrapper>
    );
};

export const AnimatedTimer = ({ isHovered, ...props }: AnimatedIconProps) => {
    const controls = useIconAnimation(isHovered);
    const cb = [0.4, 0, 0.2, 1];
    return (
        <IconWrapper controls={controls} {...props}>
            <motion.line x1="10" x2="14" y1="2" y2="2" variants={{ normal: { scale: 1, y: 0 }, animate: { scale: [0.9, 1], y: [0, 1, 0], transition: { duration: 0.3, ease: cb } } } as any} />
            <motion.line x1="12" x2="15" y1="14" y2="11" variants={{ normal: { rotate: 0, originX: "0%", originY: "100%", transition: { duration: 0.6, ease: cb } }, animate: { rotate: 300, originX: "0%", originY: "100%", transition: { delay: 0.1, duration: 0.6, ease: cb } } } as any} />
            <circle cx="12" cy="14" r="8" />
        </IconWrapper>
    );
};

export const AnimatedTornado = ({ isHovered, ...props }: AnimatedIconProps) => {
    const controls = useIconAnimation(isHovered);
    const tVar = (custom: number) => ({ normal: { x: 0, opacity: 1, transition: { duration: 0.3, ease: "easeInOut" } }, animate: { x: [0, custom * 1, 0], opacity: 1, transition: { x: { duration: 0.6, repeat: 1, ease: "easeInOut", delay: custom * 0.1 } } } } as any);
    return (
        <IconWrapper controls={controls} {...props}>
            <motion.path d="M21 4H3" variants={tVar(1)} />
            <motion.path d="M18 8H6" variants={tVar(2)} />
            <motion.path d="M19 12H9" variants={tVar(3)} />
            <motion.path d="M16 16h-6" variants={tVar(4)} />
            <motion.path d="M11 20H9" variants={tVar(5)} />
        </IconWrapper>
    );
};

export const AnimatedTrendingDown = ({ isHovered, ...props }: AnimatedIconProps) => {
    const controls = useIconAnimation(isHovered);
    return (
        <IconWrapper controls={controls} {...props} variants={{ normal: {}, animate: { x: 0, y: 0, translateX: [0, 2, 0], translateY: [0, 2, 0], transition: { duration: 0.5 } } }}>
            <motion.polyline points="22 17 13.5 8.5 8.5 13.5 2 7" variants={{ normal: { opacity: 1, pathLength: 1 }, animate: { opacity: [0, 1], pathLength: [0, 1], pathOffset: [1, 0], transition: { duration: 0.4 } } } as any} />
            <motion.polyline points="16 17 22 17 22 11" variants={{ normal: { opacity: 1, pathLength: 1 }, animate: { opacity: [0, 1], pathLength: [0, 1], pathOffset: [0.5, 0], transition: { delay: 0.3, duration: 0.3 } } } as any} />
        </IconWrapper>
    );
};

export const AnimatedTrendingUp = ({ isHovered, ...props }: AnimatedIconProps) => {
    const controls = useIconAnimation(isHovered);
    return (
        <IconWrapper controls={controls} {...props} variants={{ normal: {}, animate: { x: 0, y: 0, translateX: [0, 2, 0], translateY: [0, -2, 0], transition: { duration: 0.5 } } }}>
            <motion.polyline points="22 7 13.5 15.5 8.5 10.5 2 17" variants={{ normal: { opacity: 1, pathLength: 1 }, animate: { opacity: [0, 1], pathLength: [0, 1], pathOffset: [1, 0], transition: { duration: 0.4 } } } as any} />
            <motion.polyline points="16 7 22 7 22 13" variants={{ normal: { opacity: 1, pathLength: 1 }, animate: { opacity: [0, 1], pathLength: [0, 1], pathOffset: [0.5, 0], transition: { delay: 0.3, duration: 0.3 } } } as any} />
        </IconWrapper>
    );
};

export const AnimatedTrendingUpDown = ({ isHovered, ...props }: AnimatedIconProps) => {
    const controls = useIconAnimation(isHovered);
    const lineVar = { normal: { opacity: 1, pathLength: 1 }, animate: { opacity: [0, 1], pathLength: [0, 1], pathOffset: [1, 0], transition: { duration: 0.4 } } } as any;
    const arrowVar = { normal: { opacity: 1, pathLength: 1 }, animate: { opacity: [0, 1], pathLength: [0, 1], pathOffset: [0.5, 0], transition: { delay: 0.3, duration: 0.3 } } } as any;
    return (
        <IconWrapper controls={controls} {...props} variants={{ normal: {}, animate: { x: 0, y: 0, translateX: [0, 2, 0], transition: { duration: 0.5 } } }}>
            <motion.path d="M21 21 14.828 14.828" variants={lineVar} />
            <motion.path d="M21 16v5h-5" variants={arrowVar} />
            <motion.path d="m21 3-9 9-4-4-6 6" variants={lineVar} />
            <motion.path d="M21 8V3h-5" variants={arrowVar} />
        </IconWrapper>
    );
};

export const AnimatedTruck = ({ isHovered, ...props }: AnimatedIconProps) => {
    const controls = useIconAnimation(isHovered);

    return (
        <IconWrapper controls={controls} {...props} className="overflow-visible">
            {[{ y: 8, width: 5, x: 0 }, { y: 11, width: 7, x: -1 }, { y: 14, width: 4, x: 0 }].map((l, i) => (
                <motion.line
                    key={i}
                    x1={l.x}
                    x2={l.x + l.width}
                    y1={l.y}
                    y2={l.y}
                    variants={{
                        normal: { opacity: 0, x: 0, scaleX: 0 },
                        animate: {
                            opacity: [0, 0.7, 0.5, 0],
                            x: [0, -4, -10, -16],
                            scaleX: [0.2, 1, 0.8, 0.3],
                            transition: { duration: 0.5, ease: "easeOut", delay: i * 0.08, times: [0, 0.2, 0.6, 1] }
                        }
                    } as any}
                />
            ))}
            <motion.g variants={{
                normal: { x: 0, y: 0 },
                animate: { y: [0, -1, 0, -0.5, 0], transition: { duration: 0.4, ease: "easeInOut" } }
            } as any}>
                <path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2" />
                <path d="M15 18H9" />
                <path d="M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.624l-3.48-4.35A1 1 0 0 0 17.52 8H14" />
                <motion.g style={{ transformOrigin: "7px 18px" }} variants={{
                    normal: { rotate: 0 },
                    animate: { rotate: 360, transition: { duration: 0.5, ease: "linear" } }
                } as any}>
                    <circle cx="7" cy="18" r="2" /><line strokeWidth="1.5" x1="7" x2="7" y1="16.5" y2="19.5" /><line strokeWidth="1.5" x1="5.5" x2="8.5" y1="18" y2="18" />
                </motion.g>
                <motion.g style={{ transformOrigin: "17px 18px" }} variants={{
                    normal: { rotate: 0 },
                    animate: { rotate: 360, transition: { duration: 0.5, ease: "linear" } }
                } as any}>
                    <circle cx="17" cy="18" r="2" /><line strokeWidth="1.5" x1="17" x2="17" y1="16.5" y2="19.5" /><line strokeWidth="1.5" x1="15.5" x2="18.5" y1="18" y2="18" />
                </motion.g>
            </motion.g>
        </IconWrapper>
    );
};

export const AnimatedUnderline = ({ isHovered, ...props }: AnimatedIconProps) => {
    const controls = useIconAnimation(isHovered);
    return (
        <IconWrapper controls={controls} {...props}>
            <motion.path d="M6 4v6a6 6 0 0 0 12 0V4" variants={{ normal: { pathLength: 1, opacity: 1, pathOffset: 0 }, animate: { pathLength: [0, 1], opacity: [0, 1], pathOffset: [1, 0] } } as any} transition={{ duration: 0.3 }} />
            <motion.line x1="4" x2="20" y1="20" y2="20" variants={{ normal: { pathLength: 1, opacity: 1, pathOffset: 0 }, animate: { pathLength: [0, 1], opacity: [0, 1], pathOffset: [1, 0] } } as any} transition={{ delay: 0.2, duration: 0.4 }} />
        </IconWrapper>
    );
};

export const AnimatedUndo = ({ isHovered, ...props }: AnimatedIconProps) => {
    const controls = useIconAnimation(isHovered);
    const cb = [0.25, 0.1, 0.25, 1];
    return (
        <IconWrapper controls={controls} {...props}>
            <motion.path d="M3 7v6h6" variants={{ normal: { translateX: 0, translateY: 0, rotate: 0 }, animate: { translateX: [0, 2.1, 0], translateY: [0, -1.4, 0], rotate: [0, 12, 0], transition: { duration: 0.6, ease: cb } } } as any} />
            <motion.path d="M21 17a9 9 0 0 0-9-9 9 9 0 0 0-6 2.3L3 13" variants={{ normal: { pathLength: 1 }, animate: { pathLength: [1, 0.8, 1], transition: { duration: 0.6, ease: cb } } } as any} />
        </IconWrapper>
    );
};

export const AnimatedUndoDot = ({ isHovered, ...props }: AnimatedIconProps) => {
    const controls = useIconAnimation(isHovered);
    const cb = [0.25, 0.1, 0.25, 1];
    return (
        <IconWrapper controls={controls} {...props}>
            <motion.path d="M3 7v6h6" variants={{ normal: { translateX: 0, translateY: 0, rotate: 0 }, animate: { translateX: [0, 2.1, 0], translateY: [0, -1.4, 0], rotate: [0, 12, 0], transition: { duration: 0.6, ease: cb } } } as any} />
            <motion.path d="M21 17a9 9 0 0 0-15-6.7L3 13" variants={{ normal: { pathLength: 1 }, animate: { pathLength: [1, 0.8, 1], transition: { duration: 0.6, ease: cb } } } as any} />
            <motion.circle cx="12" cy="17" r="1" variants={{ normal: { scale: 1 }, animate: { scale: [1, 1.2, 1], transition: { duration: 0.6, ease: cb } } } as any} />
        </IconWrapper>
    );
};

export const AnimatedUpload = ({ isHovered, ...props }: AnimatedIconProps) => {
    const controls = useIconAnimation(isHovered);
    return (
        <IconWrapper controls={controls} {...props}>
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <motion.g variants={{ normal: { y: 0 }, animate: { y: -2, transition: { type: "spring", stiffness: 200, damping: 10, mass: 1 } } } as any}>
                <polyline points="17 8 12 3 7 8" /><line x1="12" x2="12" y1="3" y2="15" />
            </motion.g>
        </IconWrapper>
    );
};

export const AnimatedUpvote = ({ isHovered, ...props }: AnimatedIconProps) => {
    const controls = useIconAnimation(isHovered);
    return (
        <IconWrapper controls={controls} {...props}>
            <motion.g variants={{ normal: { translateX: "0px", translateY: "0px", rotate: "0deg" }, animate: { translateX: "-1px", translateY: "-2px", rotate: "-12deg", transition: { type: "spring", stiffness: 250, damping: 25 } } } as any}>
                <path d="M7 10v12" />
                <path d="M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2.76a2 2 0 0 0 1.79-1.11L12 2a3.13 3.13 0 0 1 3 3.88Z" />
            </motion.g>
        </IconWrapper>
    );
};

export const AnimatedUserCheck = ({ isHovered, ...props }: AnimatedIconProps) => {
    const controls = useIconAnimation(isHovered);
    return (
        <IconWrapper controls={controls} {...props}>
            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <motion.path d="M16 11L18 13L22 9" style={{ transformOrigin: "center" }} variants={{ normal: { pathLength: 1, opacity: 1 }, animate: { pathLength: [0, 1], opacity: [0, 1], transition: { duration: 0.4, ease: "easeInOut" } } } as any} />
        </IconWrapper>
    );
};

export const AnimatedUserRoundCheck = ({ isHovered, ...props }: AnimatedIconProps) => {
    const controls = useIconAnimation(isHovered);
    return (
        <IconWrapper controls={controls} {...props}>
            <path d="M2 21a8 8 0 0 1 13.292-6" />
            <circle cx="10" cy="8" r="5" />
            <motion.path d="m16 19 2 2 4-4" style={{ transformOrigin: "center" }} variants={{ normal: { pathLength: 1, opacity: 1 }, animate: { pathLength: [0, 1], opacity: [0, 1], transition: { duration: 0.4, ease: "easeInOut" } } } as any} />
        </IconWrapper>
    );
};

export const AnimatedUsers = ({ isHovered, ...props }: AnimatedIconProps) => {
    const controls = useIconAnimation(isHovered);
    const pVar = { normal: { translateX: 0, transition: { type: "spring", stiffness: 200, damping: 13 } }, animate: { translateX: [-6, 0], transition: { delay: 0.1, type: "spring", stiffness: 200, damping: 13 } } } as any;
    return (
        <IconWrapper controls={controls} {...props}>
            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <motion.path d="M22 21v-2a4 4 0 0 0-3-3.87" variants={pVar} />
            <motion.path d="M16 3.13a4 4 0 0 1 0 7.75" variants={pVar} />
        </IconWrapper>
    );
};

export const AnimatedVolume = ({ isHovered, ...props }: AnimatedIconProps) => {
    const controls = useIconAnimation(isHovered);
    return (
        <IconWrapper controls={controls} {...props}>
            <path d="M11 4.702a.705.705 0 0 0-1.203-.498L6.413 7.587A1.4 1.4 0 0 1 5.416 8H3a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h2.416a1.4 1.4 0 0 1 .997.413l3.383 3.384A.705.705 0 0 0 11 19.298z" />
            <motion.g animate={isHovered ? "animate" : "normal"} variants={{ normal: { opacity: 0 }, animate: { opacity: 1, transition: { duration: 0.3 } } } as any}>
                <motion.path d="M16 9a5 5 0 0 1 0 6" variants={{ normal: { opacity: 0 }, animate: { opacity: 1, transition: { delay: 0.1 } } } as any} />
                <motion.path d="M19.364 18.364a9 9 0 0 0 0-12.728" variants={{ normal: { opacity: 0 }, animate: { opacity: 1, transition: { delay: 0.2 } } } as any} />
            </motion.g>
            <motion.g animate={isHovered ? "animate" : "normal"} variants={{ normal: { opacity: 1 }, animate: { opacity: 0 } } as any}>
                <motion.line x1="22" x2="16" y1="9" y2="15" variants={{ normal: { pathLength: 1, opacity: 1 }, animate: { pathLength: [0, 1], opacity: [0, 1], transition: { delay: 0.1 } } } as any} />
                <motion.line x1="16" x2="22" y1="9" y2="15" variants={{ normal: { pathLength: 1, opacity: 1 }, animate: { pathLength: [0, 1], opacity: [0, 1], transition: { delay: 0.2 } } } as any} />
            </motion.g>
        </IconWrapper>
    );
};

export const AnimatedWaves = ({ isHovered, ...props }: AnimatedIconProps) => {
    const controls = useIconAnimation(isHovered);
    const waveVar = { normal: { pathLength: 1 }, animate: { pathLength: [0, 1], transition: { duration: 0.4, ease: "linear" } } } as any;
    return (
        <IconWrapper controls={controls} {...props}>
            <motion.path d="M2 6c.6.5 1.2 1 2.5 1C7 7 7 5 9.5 5c2.6 0 2.4 2 5 2c2.5 0 2.5-2 5-2c1.3 0 1.9.5 2.5 1" variants={waveVar} />
            <motion.path d="M2 12c.6.5 1.2 1 2.5 1c2.5 0 2.5-2 5-2c2.6 0 2.4 2 5 2c2.5 0 2.5-2 5-2c1.3 0 1.9.5 2.5 1" variants={waveVar} />
            <motion.path d="M2 18c.6.5 1.2 1 2.5 1c2.5 0 2.5-2 5-2c2.6 0 2.4 2 5 2c2.5 0 2.5-2 5-2c1.3 0 1.9.5 2.5 1" variants={waveVar} />
        </IconWrapper>
    );
};

export const AnimatedWaypoints = ({ isHovered, ...props }: AnimatedIconProps) => {
    const controls = useIconAnimation(isHovered);
    const wpVar = (custom: number) => ({ normal: { pathLength: 1, opacity: 1 }, animate: { pathLength: [0, 1], opacity: [0, 1], transition: { delay: 0.15 * custom, opacity: { delay: 0.1 * custom } } } } as any);
    return (
        <IconWrapper controls={controls} {...props}>
            <motion.circle cx="12" cy="4.5" r="2.5" variants={wpVar(0)} />
            <motion.path d="m10.2 6.3-3.9 3.9" variants={wpVar(1)} />
            <motion.circle cx="4.5" cy="12" r="2.5" variants={wpVar(0)} />
            <motion.path d="M7 12h10" variants={wpVar(2)} />
            <motion.circle cx="19.5" cy="12" r="2.5" variants={wpVar(0)} />
            <motion.path d="m13.8 17.7 3.9-3.9" variants={wpVar(3)} />
            <motion.circle cx="12" cy="19.5" r="2.5" variants={wpVar(0)} />
        </IconWrapper>
    );
};

export const AnimatedWebhook = ({ isHovered, ...props }: AnimatedIconProps) => {
    const controls = useIconAnimation(isHovered);
    const pVar = { normal: { pathLength: 1, opacity: 1 }, animate: { pathLength: [0, 1], opacity: [0, 1], transition: { duration: 0.3, delay: 0.1, opacity: { delay: 0.15 } } } } as any;
    return (
        <IconWrapper controls={controls} {...props}>
            <motion.path d="M18 16.98h-5.99c-1.1 0-1.95.94-2.48 1.9A4 4 0 0 1 2 17c.01-.7.2-1.4.57-2" variants={pVar} />
            <motion.path d="m6 17 3.13-5.78c.53-.97.1-2.18-.5-3.1a4 4 0 1 1 6.89-4.06" variants={pVar} />
            <motion.path d="m12 6 3.13 5.73C15.66 12.7 16.9 13 18 13a4 4 0 0 1 0 8" variants={pVar} />
        </IconWrapper>
    );
};

export const AnimatedWifiLow = ({ isHovered, ...props }: AnimatedIconProps) => {
    const controls = useIconAnimation(isHovered);
    return (
        <IconWrapper controls={controls} {...props}>
            <motion.path d="M12 20h.01" variants={{ normal: { opacity: 1 }, animate: { opacity: 1, transition: { type: "spring", stiffness: 300, damping: 20, delay: 0 } } } as any} />
            <motion.path d="M8.5 16.429a5 5 0 0 1 7 0" variants={{ normal: { opacity: 1 }, animate: { opacity: [0, 1], transition: { type: "spring", stiffness: 300, damping: 20, delay: 0.1 } } } as any} />
        </IconWrapper>
    );
};

export const AnimatedWind = ({ isHovered, ...props }: AnimatedIconProps) => {
    const controls = useIconAnimation(isHovered);
    const pVar = (custom: number) => ({ normal: { pathLength: 1, opacity: 1, pathOffset: 0, transition: { duration: 0.3, ease: "easeInOut", delay: custom } }, animate: { pathLength: [0, 1], opacity: [0, 1], pathOffset: [1, 0], transition: { duration: 0.5, ease: "easeInOut", delay: custom } } } as any);
    return (
        <IconWrapper controls={controls} {...props}>
            <motion.path d="M12.8 19.6A2 2 0 1 0 14 16H2" variants={pVar(0.2)} />
            <motion.path d="M17.5 8a2.5 2.5 0 1 1 2 4H2" variants={pVar(0)} />
            <motion.path d="M9.8 4.4A2 2 0 1 1 11 8H2" variants={pVar(0.4)} />
        </IconWrapper>
    );
};

export const AnimatedWindArrowDown = ({ isHovered, ...props }: AnimatedIconProps) => {
    const controls = useIconAnimation(isHovered);
    const pVar = (custom: number) => ({ normal: { pathLength: 1, opacity: 1, pathOffset: 0, transition: { duration: 0.3, ease: "easeInOut", delay: custom } }, animate: { pathLength: [0, 1], opacity: [0, 1], pathOffset: [1, 0], transition: { duration: 0.5, ease: "easeInOut", delay: custom } } } as any);
    const aVar = { normal: { y: 0, opacity: 1, transition: { duration: 0.3, ease: "easeInOut" } }, animate: { y: [-10, 0], opacity: [0, 1], transition: { duration: 0.5, ease: "easeInOut", delay: 0.35 } } } as any;
    return (
        <IconWrapper controls={controls} {...props}>
            <motion.path d="M12.8 21.6A2 2 0 1 0 14 18H2" variants={pVar(0.2)} />
            <motion.path d="M17.5 10a2.5 2.5 0 1 1 2 4H2" variants={pVar(0.4)} />
            <motion.path d="M10 2v8" variants={aVar} />
            <motion.path d="m6 6 4 4 4-4" variants={aVar} />
        </IconWrapper>
    );
};

export const AnimatedWorkflow = ({ isHovered, ...props }: AnimatedIconProps) => {
    const controls = useIconAnimation(isHovered);
    const wVar = (custom: number) => ({ normal: { pathLength: 1, opacity: 1 }, animate: { pathLength: [0, 1], opacity: [0, 1], transition: { duration: 0.3, delay: 0.1 * custom, opacity: { delay: 0.15 } } } } as any);
    return (
        <IconWrapper controls={controls} {...props}>
            <motion.rect x="3" y="3" width="8" height="8" rx="2" variants={wVar(0)} />
            <motion.path d="M7 11v4a2 2 0 0 0 2 2h4" variants={wVar(3)} />
            <motion.rect x="13" y="13" width="8" height="8" rx="2" variants={wVar(0)} />
        </IconWrapper>
    );
};

export const AnimatedX = ({ isHovered, ...props }: AnimatedIconProps) => {
    const controls = useIconAnimation(isHovered);
    const pVar = { normal: { opacity: 1, pathLength: 1 }, animate: { opacity: [0, 1], pathLength: [0, 1] } } as any;
    return (
        <IconWrapper controls={controls} {...props}>
            <motion.path d="M18 6 6 18" variants={pVar} />
            <motion.path d="m6 6 12 12" variants={pVar} transition={{ delay: 0.2 }} />
        </IconWrapper>
    );
};

export const AnimatedZap = ({ isHovered, ...props }: AnimatedIconProps) => {
    const controls = useIconAnimation(isHovered);
    return (
        <IconWrapper controls={controls} {...props}>
            <motion.path d="M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z" variants={{ normal: { opacity: 1, pathLength: 1, transition: { duration: 0.6 } }, animate: { opacity: [0, 1], pathLength: [0, 1], transition: { duration: 0.6 } } } as any} />
        </IconWrapper>
    );
};

export const AnimatedZapOff = ({ isHovered, ...props }: AnimatedIconProps) => {
    const controls = useIconAnimation(isHovered);
    const zVar = { normal: { opacity: 1, pathLength: 1, transition: { duration: 0.6 } }, animate: { opacity: [0, 1], pathLength: [0, 1], transition: { duration: 0.6 } } } as any;
    return (
        <IconWrapper controls={controls} {...props}>
            {["M10.513 4.856 13.12 2.17a.5.5 0 0 1 .86.46l-1.377 4.317", "M15.656 10H20a1 1 0 0 1 .78 1.63l-1.72 1.773", "M16.273 16.273 10.88 21.83a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14H4a1 1 0 0 1-.78-1.63l4.507-4.643", "m2 2 20 20"].map((d, i) => (
                <motion.path key={i} d={d} custom={i * 0.15} variants={zVar} />
            ))}
        </IconWrapper>
    );
};