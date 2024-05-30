interface LinkProps {
	link: string;
	content: string;
}

export const Link = ({ link, content }: LinkProps) => {
	return (
		<a href={link} className="text-3xl md:text-4xl text-indigo-300 hover:text-indigo-100 md:mr-6">
			{content}
		</a>
	);
};
