// ChatCard.js
import Link from 'next/link';
import Image from 'next/image';

export type Chat = {
	active?: boolean;
	seen?: boolean;
	avatar: string;
	name: string;
	text: string;
	time: string;
	textCount: number;
	dot: number;
};


const chatData: Chat[] = [
	{
	  active: true,
	  avatar: "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=200&q=80",
	  name: "David Heilo",
	  text: "Hello, how are you?",
	  time: "12 min",
	  textCount: 3,
	  dot: 3,
	},
	{
	  active: true,
	  avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=200&q=80",
	  name: "Sarah Fisher",
	  text: "I am waiting for you",
	  time: "5:54 PM",
	  textCount: 0,
	  dot: 1,
	},
	{
	  active: false,
	  avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=200&q=80",
	  name: "William Smith",
	  text: "Where are you now?",
	  time: "10:12 PM",
	  textCount: 0,
	  dot: 3,
	},
	{
	  active: true,
	  seen: true,
	  avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=200&q=80",
	  name: "Emma Chen",
	  text: "Thank you so much!",
	  time: "Sun",
	  textCount: 2,
	  dot: 6,
	},
	{
	  active: false,
	  avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=200&q=80",
	  name: "Justin Parker",
	  text: "Hello, how are you?",
	  time: "Oct 23",
	  textCount: 0,
	  dot: 3,
	},
	{
	  active: true,
	  avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=200&q=80",
	  name: "Olivia Martinez",
	  text: "I've sent the artwork files",
	  time: "Yesterday",
	  textCount: 1,
	  dot: 5,
	},
	{
	  active: false,
	  seen: true,
	  avatar: "https://images.unsplash.com/photo-1607990281513-2c110a25bd8c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=200&q=80",
	  name: "Michael Johnson",
	  text: "Let me know when you're free",
	  time: "Monday",
	  textCount: 0,
	  dot: 4,
	},
  ];
  

const ChatCard = () => {
	return (
		<div className='col-span-12 rounded-lg bg-white p-4 shadow-lg dark:bg-gray-800 h-full'>
			<div className='flex items-center justify-between mb-4'>
				<h4 className='text-lg font-semibold text-gray-800 dark:text-gray-100'>
					Messages
				</h4>
				<span className='text-sm text-blue-500 cursor-pointer hover:underline'>
					See all
				</span>
			</div>
			<div className='space-y-2 overflow-y-auto max-h-[calc(100vh-250px)]'>
				{chatData.map((chat, key) => (
					<Link
					href='/'
					className='flex items-center gap-3 p-3 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-colors'
					key={key}
				>
					<div className='relative h-12 w-12 rounded-full overflow-hidden flex-shrink-0'>
						<Image
							width={48}
							height={48}
							src={chat.avatar}
							alt='User'
							className='object-cover'
						/>
						<span
							className={`absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white dark:border-gray-800 ${
								chat.active ? 'bg-green-500' : 'bg-gray-400'
							}`}
						/>
					</div>

					<div className='flex-1 min-w-0'>
						<div className='flex justify-between items-center mb-1'>
							<h5 className='text-sm font-medium text-gray-800 dark:text-gray-100 truncate'>
								{chat.name}
							</h5>
							<span className='text-xs text-gray-500'>
								{chat.time}
							</span>
						</div>
						<p className='text-sm text-gray-600 dark:text-gray-400 truncate'>
							{chat.text}
						</p>
					</div>
					{chat.textCount > 0 && (
						<div className='flex-shrink-0 flex items-center justify-center h-5 min-w-[20px] rounded-full bg-blue-500 px-1.5'>
							<span className='text-xs font-medium text-white'>
								{chat.textCount}
							</span>
						</div>
					)}
				</Link>
				))}
			</div>
		</div>
	);
};

export default ChatCard;


