export type BetType = {
	betTypeID: number;
	nap: string;
	napDescription: string; // Added
	code: string;
	description: string; // Added
	groupCode: string; // Added
	quickPlayCode: number; // Added
	winFactor: number;
	maximumNumberOfBalls: number;
	minimumNumberOfBalls: number;
	minimumStake: number;
	maximumStake: number;
};

export type Game = {
	gameName: string;
	gameID: number;
	templateGameId: number;
	gameType: string | null;
	gameDay: string;
	gameImageUrl: string;
	gameBackgroundImageUrl: string;
	gameCode: string;
	date: string; // ISO datetime string
	startDateTime: string; // ISO datetime string
	endDateTime: string; // ISO datetime string
	isValidated: boolean;
	isActive: boolean;
	isGhanaGame: boolean;
	result: string | null;
};

export type BetList = {
	betType: BetType;
	selectedBalls: number[];
	stake: number;
	maxWinning: number;
	numberOfLines: number;
	againstBalls: number[];
	bankerBalls: number[];
	amount: number;
};

export interface GameTicket {
	id: number;
	customerID: number;
	walletBalance: number;
	possibleWin: number;
	bonus: number;
	dateRegistered: string; // ISO datetime
	gameDate: string; // ISO date
	gameCloseTime: string | null;
	payoutDate: string;
	amount: number;
	wonAmount: number;
	registrationMethod: string | null;
	game: {
		id: number;
		name: string;
	};
	ticketType: number; // Added
	status: {
		id: number;
		name: string;
	};
	betslips: BetSlip[];
	ispaid: boolean;
	isExpired: boolean;
	payoutBy: string | null;
	payoutByFullName: string | null;
	payoutByUserType: string | null;
	payoutByTerminalId: string | null;
	payoutPin: string | null;
	ticketDrawTime: string;
	expiry: string | null;
	playedBy: string;
	voucherId: number;
}

export interface BetSlip {
	id: number;
	bet1: number[];
	bet2: number[];
	stakePerLine: number;
	lines: number;
	possibleBonus: number;
	amount: number;
	wonAmount: number;
	betType: {
		id: number;
		name: string;
		code: string;
		description: string; // Added
		winFactor: number;
	};
	status: {
		id: number;
		name: string;
	};
}

export interface GameResult {
	winningBall1: number;
	winningBall2: number;
	winningBall3: number;
	winningBall4: number;
	winningBall5: number;
	machineBall1: number;
	machineBall2: number;
	machineBall3: number;
	machineBall4: number;
	machineBall5: number;
}

export interface GameResultType {
	gameName: string;
	gameID: number;
	templateGameId: number;
	gameType: string;
	gameDay: string;
	gameImageUrl: string;
	gameBackgroundImageUrl: string;
	gameCode: string;
	date: string; // ISO date string
	startDateTime: string;
	endDateTime: string;
	isValidated: boolean;
	isActive: boolean;
	isGhanaGame: boolean;
	result: GameResult;
}

export interface WinnerTicket {
	date: string; // ISO date string
	name: string;
	game: {
		id: number;
		name: string;
	};
	stakeAmount: number;
	wonAmount: number;
	winPercentage: number;
	ticketId: number;
}
