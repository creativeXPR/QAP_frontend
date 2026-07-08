// Compatibility layer over Hugeicons, exporting the same names the
// project previously imported from lucide-react. This means every
// component using e.g. `<Eye size={18} />` keeps working unchanged —
// only the import path needed to change, not each icon usage.
//
// Icon names below are verified against Hugeicons' official free
// icon list (@hugeicons/core-free-icons), not guessed.
import { HugeiconsIcon } from "@hugeicons/react";
import {
  ChevronDownIcon,
  UserIcon,
  Logout01Icon,
  UserCircleIcon,
  EyeIcon,
  EyeOffIcon,
  CheckmarkCircle02Icon,
  Calendar01Icon,
  Search01Icon,
  Menu01Icon,
  Cancel01Icon,
  File01Icon,
  Home01Icon,
  ToolsIcon,
  UserSettings01Icon,
  Clock3Icon,
  Shield01Icon,
  ClipboardListIcon,
  BarChartIcon,
  TradeUpIcon,
  TradeDownIcon,
  MinusSignIcon,
  PlusSignIcon,
  Refresh01Icon,
  UserGroupIcon,
  Layers01Icon,
  CloudUploadIcon,
  Delete02Icon,
  Edit01Icon,
  MapPinIcon,
  TelephoneIcon,
  Mail01Icon,
  InformationCircleIcon,
  LockIcon,
  SecurityCheckIcon,
  Briefcase01Icon,
  Building02Icon,
  ArrowLeft01Icon,
  FileSearchIcon,
  BellOffIcon,
  Message01Icon,
  ChatIcon,
  BulbIcon,
  Alert01Icon,
  HeadphonesIcon,
  ImageAdd01Icon,
  FileCheckIcon,
  DashboardSquare01Icon,
  AddSquareIcon,
  BellIcon,
  HourglassIcon,
  Loading03Icon,
  Activity01Icon,
  BookOpen01Icon,
  HeartIcon,
} from "@hugeicons/core-free-icons";

function makeIcon(iconRef) {
  return function Icon({ size = 18, className, ...rest }) {
    return (
      <HugeiconsIcon
        icon={iconRef}
        size={size}
        color="currentColor"
        strokeWidth={1.5}
        className={className}
        {...rest}
      />
    );
  };
}

export const ChevronDown = makeIcon(ChevronDownIcon);
export const User = makeIcon(UserIcon);
export const LogOut = makeIcon(Logout01Icon);
export const UserCircle = makeIcon(UserCircleIcon);
export const Eye = makeIcon(EyeIcon);
export const EyeOff = makeIcon(EyeOffIcon);
export const CheckCircle2 = makeIcon(CheckmarkCircle02Icon);
export const Calendar = makeIcon(Calendar01Icon);
export const Search = makeIcon(Search01Icon);
export const Menu = makeIcon(Menu01Icon);
export const X = makeIcon(Cancel01Icon);
export const FileText = makeIcon(File01Icon);
export const Home = makeIcon(Home01Icon);
export const Wrench = makeIcon(ToolsIcon);
export const UserCog = makeIcon(UserSettings01Icon);
export const Clock3 = makeIcon(Clock3Icon);
export const ShieldAlert = makeIcon(Shield01Icon);
export const ClipboardList = makeIcon(ClipboardListIcon);
export const BarChart2 = makeIcon(BarChartIcon);
export const TrendingUp = makeIcon(TradeUpIcon);
export const TrendingDown = makeIcon(TradeDownIcon);
export const Minus = makeIcon(MinusSignIcon);
export const Plus = makeIcon(PlusSignIcon);
export const RefreshCcw = makeIcon(Refresh01Icon);
export const Users = makeIcon(UserGroupIcon);
export const Layers = makeIcon(Layers01Icon);
export const UploadCloud = makeIcon(CloudUploadIcon);
export const Trash2 = makeIcon(Delete02Icon);
export const Pencil = makeIcon(Edit01Icon);
export const MapPin = makeIcon(MapPinIcon);
export const Phone = makeIcon(TelephoneIcon);
export const Mail = makeIcon(Mail01Icon);
export const Info = makeIcon(InformationCircleIcon);
export const Lock = makeIcon(LockIcon);
export const ShieldCheck = makeIcon(SecurityCheckIcon);
export const Briefcase = makeIcon(Briefcase01Icon);
export const Building2 = makeIcon(Building02Icon);
export const ArrowLeft = makeIcon(ArrowLeft01Icon);
export const FileSearch = makeIcon(FileSearchIcon);
export const BellOff = makeIcon(BellOffIcon);
export const MessageSquareText = makeIcon(Message01Icon);
export const MessageCircle = makeIcon(ChatIcon);
export const Lightbulb = makeIcon(BulbIcon);
export const AlertTriangle = makeIcon(Alert01Icon);
export const Headphones = makeIcon(HeadphonesIcon);
export const ImagePlus = makeIcon(ImageAdd01Icon);
export const FileCheck2 = makeIcon(FileCheckIcon);
export const LayoutDashboard = makeIcon(DashboardSquare01Icon);
export const PlusSquare = makeIcon(AddSquareIcon);
export const Bell = makeIcon(BellIcon);
export const Hourglass = makeIcon(HourglassIcon);
export const Loader2 = makeIcon(Loading03Icon);
export const Activity = makeIcon(Activity01Icon);
export const BookOpen = makeIcon(BookOpen01Icon);
export const Heart = makeIcon(HeartIcon);