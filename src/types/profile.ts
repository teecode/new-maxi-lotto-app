// types/profile.ts
export interface UserProfile {
	name: string;
	balance: number;
	avatar: string;
	prediction: number;
	wins: number;
	winrate: number;
	profit: number;
}

export interface ProfileMenuItemProps {
	icon: React.ReactNode;
	title: string;
	onClick?: () => void;
}

export interface UserInfoCardProps {
	name: string;
	balance: number;
	avatar: string;
	email: string;
	rank: string;
}
