import React, { useState } from "react";
import { X, Send } from "lucide-react";

export default function WhatsAppWidget() {
    const [isWhatsAppOpen, setIsWhatsAppOpen] = useState(false);
    const [message, setMessage] = useState('');

    // Handle sending WhatsApp message
    const handleSendMessage = () => {
        if (message.trim()) {
            const whatsappUrl = `https://wa.me/918300372046?text=${encodeURIComponent(message)}`;
            window.open(whatsappUrl, '_blank');
            setMessage('');
            setIsWhatsAppOpen(false);
        }
    };

    // Quick message options
    const quickMessages = [
        "Hello! I'm interested in your crackers.",
        "What are your best selling products?",
        "Do you have bulk order discounts?",
        "What are your delivery timings?"
    ];

    return (
        <div className="fixed bottom-19 right-6 z-50">
            {/* WhatsApp Chat Window */}
            {isWhatsAppOpen && (
                <div className="absolute bottom-16 right-0 w-80 bg-white rounded-lg shadow-2xl border border-gray-200 overflow-hidden mb-4">
                    {/* Header */}
                    <div className="bg-green-600 text-white p-4 flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-green-700 rounded-full flex items-center justify-center">
                                <span className="text-sm font-bold">SC</span>
                            </div>
                            <div>
                                <h3 className="font-semibold text-sm">Super Crackers</h3>
                                <p className="text-xs text-green-100">Typically replies instantly</p>
                            </div>
                        </div>
                        <button
                            onClick={() => setIsWhatsAppOpen(false)}
                            className="text-white hover:text-gray-200 transition-colors"
                        >
                            <X size={20} />
                        </button>
                    </div>

                    {/* Chat Area */}
                    <div className="h-64 overflow-y-auto p-4 bg-gray-50">
                        {/* Welcome Message */}
                        <div className="mb-4">
                            <div className="bg-white p-3 rounded-lg shadow-sm max-w-xs">
                                <p className="text-sm text-gray-800">
                                    Hi there! Welcome to Super Crackers. How can we help you today?
                                </p>
                                <p className="text-xs text-gray-500 mt-1">Just now</p>
                            </div>
                        </div>

                        {/* Quick Message Options */}
                        <div className="space-y-2">
                            <p className="text-xs text-gray-600 mb-2">Quick messages:</p>
                            {quickMessages.map((quickMsg, index) => (
                                <button
                                    key={index}
                                    onClick={() => setMessage(quickMsg)}
                                    className="block w-full text-left p-2 bg-white border border-gray-200 rounded-lg text-sm hover:bg-gray-50 transition-colors"
                                >
                                    {quickMsg}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Message Input */}
                    <div className="p-4 border-t border-gray-200 bg-white">
                        <div className="flex items-center space-x-2">
                            <input
                                type="text"
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                placeholder="Type your message..."
                                className="flex-1 p-2 border border-gray-300 rounded-full focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none text-sm"
                                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                            />
                            <button
                                onClick={handleSendMessage}
                                className="bg-green-500 hover:bg-green-600 text-white p-2 rounded-full transition-colors"
                            >
                                <Send size={16} />
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* WhatsApp Button */}
            <div className="relative group">
                <button
                    onClick={() => setIsWhatsAppOpen(!isWhatsAppOpen)}
                    className="bg-green-500 hover:bg-green-600 text-white p-3 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110 animate-pulse"
                >
                    {/* WhatsApp Icon SVG */}
                    <svg
                        width="28"
                        height="28"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className="text-white"
                    >
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                    </svg>
                </button>

                {/* Tooltip */}
                {!isWhatsAppOpen && (
                    <div className="absolute bottom-full right-0 mb-2 px-3 py-2 bg-green-600 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 invisible group-hover:visible transition-all duration-200 whitespace-nowrap">
                        WhatsApp Us
                        <div className="absolute top-full right-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-green-600"></div>
                    </div>
                )}
            </div>
        </div>
    );
}