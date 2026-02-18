import { PageConfig } from "@/lib/config/pageVisibility";
import { MagazineIssueCard } from "@/lib/pages/magazine/types/magazine";

// Tab types
export type ContentSettingsTab = "visibility" | "content" | "magazine";

// Page content types
export type EditablePage = "home" | "forClients";

// Login form state
export interface LoginFormState {
  email: string;
  password: string;
}

// Content settings state
export interface ContentSettingsState {
  settings: PageConfig[];
  isLoading: boolean;
  isSaving: boolean;
  showSuccess: boolean;
  isAuthenticated: boolean;
  activeTab: ContentSettingsTab;
  selectedPage: EditablePage;
  pageContent: any;
  isLoadingContent: boolean;
  isSavingContent: boolean;
  magazineIssues: MagazineIssueCard[];
  isLoadingMagazine: boolean;
  isSavingMagazine: boolean;
  editingIssue: MagazineIssueCard | null;
  showAddIssue: boolean;
}

// Magazine form props
export interface MagazineIssueFormProps {
  issue?: MagazineIssueCard;
  onSave: (issue: MagazineIssueCard) => void;
  onCancel: () => void;
  isSaving: boolean;
}

// Tab component props
export interface TabProps {
  isAuthenticated: boolean;
}

export interface PageVisibilityTabProps extends TabProps {
  settings: PageConfig[];
  isSaving: boolean;
  showSuccess: boolean;
  onToggle: (path: string) => void;
  onSave: () => void;
  onReset: () => void;
  onExport: () => void;
  onImport: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export interface PageContentTabProps extends TabProps {
  selectedPage: EditablePage;
  pageContent: any;
  isLoadingContent: boolean;
  isSavingContent: boolean;
  onPageChange: (page: EditablePage) => void;
  onContentUpdate: (path: string[], value: any) => void;
  onSave: () => void;
}

export interface MagazineManagementTabProps extends TabProps {
  magazineIssues: MagazineIssueCard[];
  isLoadingMagazine: boolean;
  isSavingMagazine: boolean;
  editingIssue: MagazineIssueCard | null;
  showAddIssue: boolean;
  onToggleFeatured: (id: string) => void;
  onDeleteIssue: (id: string) => void;
  onEditIssue: (issue: MagazineIssueCard) => void;
  onAddIssue: () => void;
  onSaveIssue: (issue: MagazineIssueCard) => void;
  onCancelEdit: () => void;
}
