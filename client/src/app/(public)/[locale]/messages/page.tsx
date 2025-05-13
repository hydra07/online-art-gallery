
// ChatPage.js
import ChatCard from './components/chat-card';
import ChatComponent from './components/chat-component';

export default function ChatPage() {
	return (
		<div className='min-h-screen flex items-center justify-center bg-gray-100 p-10'>
			<div className='w-full max-w-[1400px] flex rounded-lg  overflow-hidden '>
				<div className='w-1/3 max-h-[80vh] overflow-y-auto p-4 '>
					<ChatCard />
				</div>
				<div className='w-2/3 max-h-[80vh] overflow-y-auto p-4'>
					<ChatComponent />
				</div>
			</div>
		</div>
	);
}
