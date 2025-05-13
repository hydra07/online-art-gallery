'use client';

import { useLocale } from 'next-intl';
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from '@/components/ui/accordion';
import { CheckCircle, XCircle, Info, AlertTriangle, Check, ChevronRight } from 'lucide-react';
import { useMemo } from 'react';

// Move content outside component to prevent recreation on each render
const content = {
    en: {
        title: 'Art Review Policy',
        sections: [
            {
                title: 'Review Process Description',
                content: [
                    {
                        subtitle: 'Automated Review System',
                        text: 'All submitted artwork goes through our AI review system that evaluates content based on artistic merit and community standards'
                    },
                    {
                        subtitle: 'Review Outcomes',
                        list: [
                            'Automatic approval: Work meets all guidelines',
                            'Automatic rejection: Work contains clear violations',
                            'Admin review: Work needs human evaluation for borderline concerns'
                        ]
                    },
                    {
                        subtitle: 'Appeal Process',
                        text: 'Artists can appeal automatic rejections with additional context or modifications'
                    }
                ]
            },
            {
                title: 'Content Guidelines',
                content: [
                    {
                        subtitle: 'Automatic Rejection (Clear Violations)',
                        description: 'Rejected without admin review',
                        list: [
                            'Child exploitation content',
                            'Terrorism promotion or instructions',
                            'Direct incitement to violence against groups',
                            'Explicit instructions for serious criminal activities'
                        ]
                    },
                    {
                        subtitle: 'Admin Review Required (Borderline Concerns)',
                        description: 'Decision pending human review',
                        list: [
                            'Artistic nudity',
                            'Strong political/social commentary',
                            'Violence in artistic/historical context',
                            'Strong language/profanity',
                            'Potential copyright questions',
                            'Abstract depictions of sensitive themes'
                        ]
                    },
                    {
                        subtitle: 'Acceptable Content',
                        description: 'Automatic approval',
                        list: [
                            'Creative expression within guidelines',
                            'Technical artistic merit',
                            'Conceptual depth and meaning',
                            'Challenging but constructive content'
                        ]
                    }
                ]
            }
        ],
        guidelines: {
            title: "Artists' Guide to Content Approval",
            do: [
                'Provide clear artistic context for challenging works',
                'Explain artistic intent for sensitive themes',
                'Include references for historically inspired works',
                'Tag mature content appropriately',
                'Focus on artistic expression and meaningful content'
            ],
            dont: [
                'Submit content depicting minors in sexual contexts',
                'Create content promoting terrorist activities',
                'Submit works inciting violence against specific groups',
                'Provide detailed instructions for serious illegal activities',
                'Submit direct copies of others\' work'
            ]
        }
    },
    vi: {
        title: 'Chính sách đánh giá nghệ thuật',
        sections: [
            {
                title: 'Quy trình đánh giá',
                content: [
                    {
                        subtitle: 'Hệ thống đánh giá tự động',
                        text: 'Tất cả tác phẩm gửi lên đều được hệ thống AI đánh giá dựa trên giá trị nghệ thuật và tiêu chuẩn cộng đồng'
                    },
                    {
                        subtitle: 'Kết quả đánh giá',
                        list: [
                            'Tự động phê duyệt: Tác phẩm đáp ứng tất cả hướng dẫn',
                            'Tự động từ chối: Tác phẩm chứa vi phạm rõ ràng',
                            'Đánh giá bởi quản trị viên: Tác phẩm cần đánh giá của con người cho các vấn đề cần cân nhắc'
                        ]
                    },
                    {
                        subtitle: 'Quy trình kháng nghị',
                        text: 'Nghệ sĩ có thể kháng nghị các trường hợp từ chối tự động với bối cảnh bổ sung hoặc sửa đổi'
                    }
                ]
            },
            {
                title: 'Hướng dẫn nội dung',
                content: [
                    {
                        subtitle: 'Từ chối tự động (Vi phạm rõ ràng)',
                        description: 'Từ chối không cần quản trị viên xem xét',
                        list: [
                            'Nội dung khai thác trẻ em',
                            'Tuyên truyền hoặc hướng dẫn khủng bố',
                            'Kích động trực tiếp bạo lực chống lại các nhóm',
                            'Hướng dẫn cụ thể cho các hoạt động tội phạm nghiêm trọng'
                        ]
                    },
                    {
                        subtitle: 'Yêu cầu đánh giá của quản trị viên (Vấn đề cần cân nhắc)',
                        description: 'Quyết định chờ đánh giá của con người',
                        list: [
                            'Khỏa thân nghệ thuật',
                            'Bình luận chính trị/xã hội mạnh mẽ',
                            'Bạo lực trong bối cảnh nghệ thuật/lịch sử',
                            'Ngôn ngữ mạnh/thô tục',
                            'Câu hỏi về bản quyền tiềm ẩn',
                            'Mô tả trừu tượng về chủ đề nhạy cảm'
                        ]
                    },
                    {
                        subtitle: 'Nội dung được chấp nhận',
                        description: 'Tự động phê duyệt',
                        list: [
                            'Biểu đạt sáng tạo trong khuôn khổ hướng dẫn',
                            'Giá trị nghệ thuật kỹ thuật',
                            'Chiều sâu ý tưởng và ý nghĩa',
                            'Nội dung thử thách nhưng mang tính xây dựng'
                        ]
                    }
                ]
            }
        ],
        guidelines: {
            title: 'Hướng dẫn cho nghệ sĩ để được phê duyệt nội dung',
            do: [
                'Cung cấp bối cảnh nghệ thuật rõ ràng cho các tác phẩm thách thức',
                'Giải thích ý định nghệ thuật cho các chủ đề nhạy cảm',
                'Bao gồm tài liệu tham khảo cho các tác phẩm lấy cảm hứng từ lịch sử',
                'Gắn thẻ nội dung trưởng thành một cách phù hợp',
                'Tập trung vào biểu đạt nghệ thuật và nội dung có ý nghĩa'
            ],
            dont: [
                'Gửi nội dung mô tả trẻ vị thành niên trong bối cảnh tình dục',
                'Tạo nội dung quảng bá hoạt động khủng bố',
                'Gửi tác phẩm kích động bạo lực chống lại các nhóm cụ thể',
                'Cung cấp hướng dẫn chi tiết cho các hoạt động bất hợp pháp nghiêm trọng',
                'Gửi bản sao trực tiếp tác phẩm của người khác'
            ]
        }
    }
};

// Define types for content structure
type ContentItem = {
    subtitle: string;
    text?: string;
    description?: string;
    list?: string[];
};

type Section = {
    title: string;
    content: ContentItem[];
};

type Guidelines = {
    title: string;
    do: string[];
    dont: string[];
};

type LocaleContent = {
    title: string;
    sections: Section[];
    guidelines: Guidelines;
};

export default function ArtReviewPolicy() {
    const locale = useLocale();

    // Use memoization to avoid recalculating on every render
    const currentContent: LocaleContent = useMemo(() => {
        return locale === 'en' ? content.en : content.vi;
    }, [locale]);

    return (
        <div className="p-4 space-y-4">
            {/* Simplified intro card */}
            <div className="flex items-start gap-3 bg-blue-50/50 dark:bg-blue-900/20 rounded-lg p-3 border border-blue-100 dark:border-blue-800/40">
                <Info className="h-4 w-4 text-blue-500 dark:text-blue-400 mt-0.5 shrink-0" />
                <p className="text-xs text-blue-700/80 dark:text-blue-300/90 leading-relaxed">
                    {locale === 'en' 
                        ? 'Every artwork submission is reviewed against our community guidelines. Please review these policies before uploading.' 
                        : 'Mỗi tác phẩm được đánh giá theo hướng dẫn cộng đồng. Vui lòng xem các chính sách trước khi tải lên.'}
                </p>
            </div>

            <Accordion type="single" collapsible className="space-y-3">
                {currentContent.sections.map((section, index) => (
                    <AccordionItem 
                        key={index} 
                        value={`section-${index}`} 
                        className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden bg-white dark:bg-gray-850 shadow-sm group"
                    >
                        <AccordionTrigger className="text-sm font-medium py-2.5 px-3.5 hover:bg-gray-50/80 dark:hover:bg-gray-800/60 transition-all group">
                            <div className="flex items-center w-full text-gray-700 dark:text-gray-300">
                                <div className="h-3 w-0.5 bg-primary/70 mr-2.5 group-data-[state=open]:h-4 transition-all"></div>
                                <span className="group-data-[state=open]:text-primary group-data-[state=open]:font-semibold transition-colors">{section.title}</span>
                            </div>
                        </AccordionTrigger>
                        <AccordionContent className="space-y-3 px-3.5 pb-3 pt-1">
                            {section.content.map((item, itemIndex) => (
                                <div 
                                    key={itemIndex} 
                                    className="space-y-2 bg-gray-50/80 dark:bg-gray-800/30 rounded-lg p-3"
                                >
                                    <h4 className="font-medium text-primary text-sm flex items-center gap-1.5">
                                        <ChevronRight className="h-3 w-3 text-primary/70" strokeWidth={2.5} />
                                        {item.subtitle}
                                    </h4>
                                    
                                    {item.text && <p className="text-xs text-gray-700 dark:text-gray-300 ml-4.5">{item.text}</p>}
                                    
                                    {item.description && (
                                        <p className="text-xs text-gray-500 dark:text-gray-400 italic ml-4.5">
                                            {item.description}
                                        </p>
                                    )}
                                    
                                    {item.list && (
                                        <ul className="space-y-0.5 text-xs ml-4.5">
                                            {item.list.map((listItem, listIndex) => {
                                                // Logic to determine content type
                                                const isPositive = listItem.toLowerCase().includes('meets all') || 
                                                                  listItem.toLowerCase().includes('approval') || 
                                                                  listItem.toLowerCase().includes('merit') || 
                                                                  listItem.toLowerCase().includes('creative');
                                                const isNegative = listItem.toLowerCase().includes('rejection') || 
                                                                  listItem.toLowerCase().includes('violation') || 
                                                                  listItem.toLowerCase().includes('exploit') || 
                                                                  listItem.toLowerCase().includes('terror');
                                                const isNeutral = listItem.toLowerCase().includes('review') || 
                                                                 listItem.toLowerCase().includes('pending') || 
                                                                 listItem.toLowerCase().includes('artistic');
                                                
                                                // Determine icon by content type
                                                const iconColor = isPositive ? "text-green-500" : 
                                                                isNegative ? "text-red-500" : 
                                                                isNeutral ? "text-amber-500" : "text-gray-500";
                                                
                                                const icon = isPositive ? <CheckCircle className={`h-3.5 w-3.5 ${iconColor} mr-1.5 shrink-0`} /> :
                                                           isNegative ? <XCircle className={`h-3.5 w-3.5 ${iconColor} mr-1.5 shrink-0`} /> :
                                                           isNeutral ? <AlertTriangle className={`h-3.5 w-3.5 ${iconColor} mr-1.5 shrink-0`} /> :
                                                           <Check className={`h-3.5 w-3.5 ${iconColor} mr-1.5 shrink-0`} />;
                                                
                                                return (
                                                    <li key={listIndex} className="flex items-start">
                                                        {icon}
                                                        <span className="text-gray-600 dark:text-gray-300">{listItem}</span>
                                                    </li>
                                                );
                                            })}
                                        </ul>
                                    )}
                                </div>
                            ))}
                        </AccordionContent>
                    </AccordionItem>
                ))}

                {/* Guidelines condensed into a single panel */}
                <AccordionItem 
                    value="guidelines" 
                    className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden bg-white dark:bg-gray-850 shadow-sm group"
                >
                    <AccordionTrigger className="text-sm font-medium py-2.5 px-3.5 hover:bg-gray-50/80 dark:hover:bg-gray-800/60 transition-all group">
                        <div className="flex items-center w-full text-gray-700 dark:text-gray-300">
                            <div className="h-3 w-0.5 bg-primary/70 mr-2.5 group-data-[state=open]:h-4 transition-all"></div>
                            <span className="group-data-[state=open]:text-primary group-data-[state=open]:font-semibold transition-colors">{currentContent.guidelines.title}</span>
                        </div>
                    </AccordionTrigger>
                    <AccordionContent className="px-3.5 pb-3 pt-1">
                        <div className="flex flex-col sm:flex-row gap-3">
                            {/* Do's Panel - More compact */}
                            <div className="flex-1 rounded-lg border border-green-100 dark:border-green-900/40 overflow-hidden">
                                <div className="bg-green-50 dark:bg-green-900/20 border-b border-green-100 dark:border-green-900/40 px-3 py-1.5">
                                    <span className="text-xs font-medium text-green-800 dark:text-green-400 flex items-center gap-1.5">
                                        <Check className="h-3 w-3" />
                                        {locale === 'en' ? 'Best Practices' : 'Thực hành tốt nhất'}
                                    </span>
                                </div>
                                
                                <div className="p-2.5">
                                    <ul className="space-y-1.5 text-xs text-green-700 dark:text-green-200">
                                        {currentContent.guidelines.do.map((item, index) => (
                                            <li key={index} className="flex items-start">
                                                <span className="inline-flex items-center justify-center bg-green-100/60 dark:bg-green-800/20 text-green-600 dark:text-green-400 rounded-full h-4 w-4 mr-2 shrink-0 mt-px">
                                                    <Check className="h-2.5 w-2.5" />
                                                </span>
                                                <span>{item}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                            
                            {/* Don'ts Panel - More compact */}
                            <div className="flex-1 rounded-lg border border-red-100 dark:border-red-900/40 overflow-hidden">
                                <div className="bg-red-50 dark:bg-red-900/20 border-b border-red-100 dark:border-red-900/40 px-3 py-1.5">
                                    <span className="text-xs font-medium text-red-800 dark:text-red-400 flex items-center gap-1.5">
                                        <XCircle className="h-3 w-3" />
                                        {locale === 'en' ? 'Content to Avoid' : 'Nội dung cần tránh'}
                                    </span>
                                </div>
                                
                                <div className="p-2.5">
                                    <ul className="space-y-1.5 text-xs text-red-700 dark:text-red-200">
                                        {currentContent.guidelines.dont.map((item, index) => (
                                            <li key={index} className="flex items-start">
                                                <span className="inline-flex items-center justify-center bg-red-100/60 dark:bg-red-800/20 text-red-600 dark:text-red-400 rounded-full h-4 w-4 mr-2 shrink-0 mt-px">
                                                    <XCircle className="h-2.5 w-2.5" />
                                                </span>
                                                <span>{item}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </AccordionContent>
                </AccordionItem>
            </Accordion>
        </div>
    );
}
