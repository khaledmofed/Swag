import { IconType } from "react-icons";
import {
  // Navigation & UI
  FiEye,
  FiCalendar,
  FiTruck,
  FiEdit3,
  FiPhone,
  FiCheckCircle,
  FiTrash2,
  FiCopy,
  FiShare2,
  FiStar,
  FiAlignRight,
  FiFilter,
  FiSearch,
  FiShoppingCart,
  FiMaximize2,
  FiHeart,
  FiArrowRight,
  FiArrowLeft,
  FiChevronRight,
  FiChevronDown,
  FiHome,
  FiUser,
  FiBriefcase,
  FiTrendingUp,
  FiFileText,
  FiMail,
  FiShield,
  FiSettings,
  FiLogOut,
  FiCreditCard,
  FiUsers,
  FiMessageSquare,
  FiPlus,
  FiUserPlus,
  FiGithub,
  FiLifeBuoy,
  FiCloud,
  FiCheck,
  FiCircle,
  FiGlobe,
  FiX,
  FiMenu,
  FiSun,
  FiMoon,
  FiArrowDown,
  FiTwitter,
  FiClock,
} from "react-icons/fi";
import { BiMenuAltLeft, BiMenuAltRight } from "react-icons/bi";
import { Vector } from "./vector";
import { Asset } from "./Asset";
import { Star4 } from "./Star-4";
import { Star3 } from "./Star-3";
import { Star2 } from "./Star-2";
import { Sun } from "./sun";
import { LeftArrowSlide } from "./left-arrow-slide";
import { RightArrowSlide } from "./right-arrow-slide";
import Saudi_Riyal_Symbol from "./Saudi_Riyal_Symbol";
import { FaSnapchat, FaInstagram, FaChartLine } from "react-icons/fa6";
import { SlSocialFacebook } from "react-icons/sl";

import {
  // Additional icons from other icon sets if needed
  HiOutlineArrowRight,
  HiOutlineChevronRight,
  HiOutlineChevronDown,
  HiOutlineChevronLeft,
} from "react-icons/hi2";

import {
  // Material Design icons for additional options
  MdArrowForward,
  MdKeyboardArrowRight,
  MdKeyboardArrowDown,
  MdOutlineCandlestickChart,
} from "react-icons/md";
import { FaChartBar } from "react-icons/fa";
// Icon name mapping to actual icon components
export const iconMap = {
  // Navigation & UI
  eye: FiEye,
  calendar: FiCalendar,
  truck: FiTruck,
  edit: FiEdit3,
  phone: FiPhone,
  checkCircle: FiCheckCircle,
  trash: FiTrash2,
  copy: FiCopy,
  star: FiStar,
  share: FiShare2,
  sort: FiAlignRight,
  filter: FiFilter,
  search: FiSearch,
  cart: FiShoppingCart,
  maximize: FiMaximize2,
  heart: FiHeart,
  "heart-filled": FiHeart,
  // "heart-filled": function HeartFilledIcon(props: any) {
  //   return (
  //     <svg
  //       viewBox="0 0 24 24"
  //       fill="currentColor"
  //       width={props.size || 16}
  //       height={props.size || 16}
  //       className={props.className}
  //       style={props.style}
  //       aria-label={props["aria-label"]}
  //     >
  //       <path d="M12.1 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41 0.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54l-1.35 1.31z" />
  //     </svg>
  //   );
  // },
  "arrow-right": FiArrowRight,
  "arrow-left": FiArrowLeft,
  "chevron-right": FiChevronRight,
  "chevron-down": FiChevronDown,
  home: FiHome,
  user: FiUser,
  briefcase: FiBriefcase,
  "trending-up": FiTrendingUp,
  "file-text": FiFileText,
  mail: FiMail,
  shield: FiShield,
  settings: FiSettings,
  "log-out": FiLogOut,
  "credit-card": FiCreditCard,
  users: FiUsers,
  "message-square": FiMessageSquare,
  plus: FiPlus,
  "arrow-menu-alt-left": BiMenuAltLeft,
  "arrow-menu-alt-right": BiMenuAltRight,
  "user-plus": FiUserPlus,
  github: FiGithub,
  "life-buoy": FiLifeBuoy,
  cloud: FiCloud,
  check: FiCheck,
  circle: FiCircle,
  globe: FiGlobe,
  x: FiX,
  menu: FiMenu,
  sun: FiSun,
  moon: FiMoon,
  "arrow-down": FiArrowDown,
  "chevron-left": HiOutlineChevronLeft,
  clock: FiClock,

  // Social Media
  snapchat: FaSnapchat,
  twitter: FiTwitter,
  instagram: FaInstagram,
  facebook: SlSocialFacebook,

  // Alternative icons (if you want different styles)
  "arrow-right-outline": HiOutlineArrowRight,
  "chevron-right-outline": HiOutlineChevronRight,
  "chevron-down-outline": HiOutlineChevronDown,
  "arrow-forward": MdArrowForward,
  "keyboard-arrow-right": MdKeyboardArrowRight,
  "keyboard-arrow-down": MdKeyboardArrowDown,
  vector: Vector,
  Asset: Asset,
  star4: Star4,
  star3: Star3,
  star2: Star2,
  "sun-icon": Sun,
  "left-arrow-slide": LeftArrowSlide,
  "right-arrow-slide": RightArrowSlide,
  candle: MdOutlineCandlestickChart,
  bar: FaChartBar,
  line: FaChartLine,
  riyal: Saudi_Riyal_Symbol,
} as const;

// Type for all available icon names
export type IconName = keyof typeof iconMap;

// Icon component props interface
export interface IconProps {
  name: IconName;
  size?: number | string;
  className?: string;
  color?: string;
  style?: React.CSSProperties;
  onClick?: () => void;
  "aria-label"?: string;
}

// Export the IconType for external use
export type { IconType };
