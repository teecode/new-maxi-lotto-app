export type SiteConfig = typeof siteConfig;

export const siteConfig = {
	name: 'MaxiLotto',
	description: 'Big Wins Start with One Game',
	links: {
		twitter: 'https://twitter.com/shadcn',
		github: 'https://github.com/shadcn/ui',
		docs: 'https://ui.shadcn.com',
	},
	baseUrl: 'http://localhost:8000/api/v1',
};

export const ticketStatus = [
	{
		id: 0,
		name: 'All',
	},
	{
		id: 1,
		name: 'Undecided',
	},
	{
		id: 2,
		name: 'Won',
	},
	{
		id: 3,
		name: 'Lost',
	},
];
