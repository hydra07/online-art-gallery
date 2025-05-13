'use client';

import ArtReviewPolicy from './art-review-policy';
import { artworkService } from '@/app/(public)/[locale]/artists/queries';
import {
    ArtworkFormData,
    artworkFormSchema
} from '@/app/(public)/[locale]/artists/schema';
import FileUploader from '@/components/ui.custom/file-uploader';
import { Button } from '@/components/ui/button';
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Toaster } from '@/components/ui/toaster';
import { useToast } from '@/hooks/use-toast';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { ArrowUp, Check, ChevronDown, ChevronUp, Eye, ImageIcon, Info, Loader2, Plus, X, 
    FileText, Tag, Layout, PenLine, ListFilter, FileImage, Settings, Clock 
} from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import Image from 'next/image';
import { useCallback, useRef, useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';

export default function UploadArtwork() {
    const [file, setFile] = useState<File | null>(null);
    const [isImageUploaded, setIsImageUploaded] = useState(false);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [showPreview, setShowPreview] = useState(false);
    const [isPolicyOpen, setIsPolicyOpen] = useState(false);
    const categoryInputRef = useRef<HTMLInputElement>(null);
    const t = useTranslations('artwork');
    const tError = useTranslations('error');
    const locale = useLocale();
    const form = useForm<ArtworkFormData>( {
        resolver: zodResolver(artworkFormSchema(t)),
        defaultValues: {
            title: '',
            description: '',
            categories: [],
            width: '',
            height: '',
            price: 0,
            status: 'available',
            imageUrl: '',
            artType: 'digitalart',
            isSelling: false,
            lowResUrl: '',
            watermarkUrl: ''
        }
    });

    const { data } = useQuery({
        queryKey: ['categories'],
        queryFn: () => artworkService.getCategories(),
        placeholderData: (previousData) => previousData,
    });
    const categories = data?.data || [];
    
    const { toast } = useToast();
    
    const mutation = useMutation({
        mutationFn: artworkService.upload,
        onSuccess: () => {
            // Show success toast with more detailed information
            toast({
                variant: 'success',
                title: t('toast.successTitle'),
                description: t('toast.successDescription'),
                duration: 5000, // Show for 5 seconds
                action: (
                    <div className="flex items-center text-sm font-medium text-green-600 dark:text-green-400">
                        <Check className="h-4 w-4 mr-1" />
                        {locale === 'en' ? 'Completed' : 'Hoàn thành'}
                    </div>
                )
            });
            
            // Reset form and state
            form.reset();
            setFile(null);
            setIsImageUploaded(false);
            setPreviewUrl(null);
            
            // Optional: scroll to top of page
            window.scrollTo({ top: 0, behavior: 'smooth' });
        },
        onError: (error: any) => {
            const errorResponse = error.response?.data || {};   
            // Show more detailed error toast
            toast({
                variant: 'destructive',
                title: t('toast.errorTitle'),
                description: errorResponse.statusCode === 403 
                    ? tError('isBanned') 
                    : errorResponse.message || t('toast.errorDescription'),
                duration: 7000, // Show errors longer
                action: (
                    <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                        className="border-red-300 text-red-600 hover:bg-red-50 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-950/30"
                    >
                        {locale === 'en' ? 'Try Again' : 'Thử lại'}
                    </Button>
                )
            });
            
            console.error('Error uploading artwork:', error);
        }
    });

    const artType = form.watch('artType');
    const status = form.watch('status');

    useEffect(() => {
        if (status === 'selling') {
            form.setValue('isSelling', true);
        } else {
            form.setValue('isSelling', false);
        }
    }, [status, form]);

    useEffect(() => {
        if (artType === 'painting' && status === 'selling') {
            form.setValue('status', 'available');
        }
    }, [artType, status, form]);

    const onSubmit = (data: ArtworkFormData) => {
        if (data.artType === 'painting' && data.status === 'selling') {
            toast({
                variant: 'destructive',
                title: t('toast.error'),
                description: t('validation.painting_cannot_sell')
            });
            return;
        }

        data.isSelling = data.status === 'selling';

        mutation.mutate(data);
    };

    // Handle adding categories with keyboard
    const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' || e.key === ',') {
            e.preventDefault();
            const value = e.currentTarget.value.trim();
            if (value && !form.getValues('categories').includes(value)) {
                const currentCategories = form.getValues('categories');
                form.setValue('categories', [...currentCategories, value], { 
                    shouldValidate: true,
                    shouldDirty: true
                });
                e.currentTarget.value = '';
            }
        }
    }, [form]);

    // Handle adding a category with button
    const handleAddCategory = useCallback(() => {
        if (!categoryInputRef.current) return;

        const value = categoryInputRef.current.value.trim();
        if (value && !form.getValues('categories').includes(value)) {
            const currentCategories = form.getValues('categories');
            form.setValue('categories', [...currentCategories, value], {
                shouldValidate: true,
                shouldDirty: true
            });
            categoryInputRef.current.value = '';
        }
    }, [form]);

    // Remove a category
    const handleRemoveCategory = useCallback((index: number) => {
        const newCategories = [...form.getValues('categories')];
        newCategories.splice(index, 1);
        form.setValue('categories', newCategories, {
            shouldValidate: true,
            shouldDirty: true
        });
    }, [form]);

    // Add a suggested category
    const handleAddSuggestedCategory = useCallback((category: string) => {
        if (!form.getValues('categories').includes(category)) {
            const currentCategories = form.getValues('categories');
            form.setValue('categories', [...currentCategories, category], {
                shouldValidate: true,
                shouldDirty: true
            });
        }
    }, [form]);

    // Toggle image preview
    const togglePreview = useCallback(() => {
        setShowPreview(!showPreview);
    }, [showPreview]);

    return (
        <div className="w-full max-w-[1200px] mx-auto px-4 sm:px-6 pb-16 pt-6">
            <Toaster />
            
            {/* Header with icon */}
            <div className="flex items-center justify-between mb-8">
                <h1 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-gray-100 flex items-center gap-3">
                    <FileImage className="h-7 w-7 text-primary" />
                    {t('title')}
                </h1>
                
                {previewUrl && (
                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={togglePreview}
                        className="flex items-center gap-2"
                    >
                        <Eye className="h-4 w-4" />
                        {showPreview ? t('upload.hidePreview') : t('upload.showPreview')}
                    </Button>
                )}
            </div>
            
            {/* Policy notice */}
            <div className="mb-8">
                <div className="flex items-center bg-blue-50/80 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800/50 rounded-lg p-4">
                    <Info className="h-4 w-4 text-blue-600 dark:text-blue-400 shrink-0 mr-4" />
                    <div className="flex-1 text-sm text-blue-700 dark:text-blue-300">
                        {locale === 'en' 
                            ? 'Before submitting, please review our content policies' 
                            : 'Trước khi gửi, vui lòng xem lại các chính sách nội dung của chúng tôi'}
                    </div>
                    <Button 
                        variant="ghost" 
                        size="sm"
                        className="ml-4 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/30 h-8"
                        onClick={() => setIsPolicyOpen(!isPolicyOpen)}
                    >
                        {isPolicyOpen 
                            ? (locale === 'en' ? 'Hide Policy' : 'Ẩn chính sách') 
                            : (locale === 'en' ? 'View Policy' : 'Xem chính sách')}
                        {isPolicyOpen ? 
                            <ChevronUp className="ml-1.5 h-4 w-4" /> : 
                            <ChevronDown className="ml-1.5 h-4 w-4" />
                        }
                    </Button>
                </div>
                
                {/* Policy panel */}
                {isPolicyOpen && (
                    <div className="mt-3 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 shadow-sm overflow-hidden">
                        <div className="bg-gray-50 dark:bg-gray-800 py-3 px-4 flex justify-between items-center border-b border-gray-200 dark:border-gray-700">
                            <h2 className="font-medium flex items-center">
                                <FileText className="h-4 w-4 mr-2 text-primary" />
                                {locale === 'en' ? 'Art Review Policy' : 'Chính sách đánh giá nghệ thuật'}
                            </h2>
                            <Button 
                                variant="ghost" 
                                size="sm" 
                                onClick={() => setIsPolicyOpen(false)}
                                className="h-8 w-8 p-0 rounded-full"
                            >
                                <X className="h-4 w-4" />
                            </Button>
                        </div>
                        <div className="max-h-[50vh] overflow-y-auto">
                            <ArtReviewPolicy />
                        </div>
                    </div>
                )}
            </div>
            
            {/* Image Preview */}
            {showPreview && previewUrl && (
                <div className="mb-8 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm overflow-hidden">
                    <div className="aspect-auto max-h-[450px] overflow-hidden relative">
                        <Image
                            src={previewUrl}
                            alt={form.getValues('title') || t('upload.preview')}
                            width={1200}
                            height={800}
                            className="w-full h-full object-contain"
                            priority
                        />
                        
                        <Button
                            type="button"
                            size="icon"
                            className="absolute top-4 right-4 bg-white/80 dark:bg-gray-800/80 hover:bg-white dark:hover:bg-gray-700 h-8 w-8 rounded-full shadow-sm"
                            onClick={togglePreview}
                        >
                            <X className="h-4 w-4" />
                        </Button>
                        
                        {form.getValues('title') && (
                            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4 text-white">
                                <h3 className="font-medium">{form.getValues('title')}</h3>
                                {form.getValues('categories').length > 0 && (
                                    <div className="flex flex-wrap gap-2 mt-2">
                                        {form.getValues('categories').map((category, index) => (
                                            <span 
                                                key={index} 
                                                className="px-2 py-0.5 text-xs bg-white/20 rounded-full"
                                            >
                                                {category}
                                            </span>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            )}
            
            {/* Main Form */}
            <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg shadow-sm">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="divide-y divide-gray-200 dark:divide-gray-800">
                        {/* Basic Information Section */}
                        <div className="p-6 space-y-6">
                            <h2 className="text-xl font-medium text-gray-900 dark:text-gray-100 mb-6 flex items-center">
                                <Settings className="h-5 w-5 mr-2 text-primary" />
                                {locale === 'en' ? 'Basic Information' : 'Thông tin cơ bản'}
                            </h2>
                            
                            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                                {/* Title - wider */}
                                <div className="md:col-span-6">
                                    <FormField
                                        control={form.control}
                                        name="title"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="flex items-center gap-2">
                                                    <PenLine className="h-3.5 w-3.5 text-gray-500 dark:text-gray-400" />
                                                    {t('field.title')}
                                                </FormLabel>
                                                <FormControl>
                                                    <Input 
                                                        placeholder={t('placeholder.title')} 
                                                        {...field} 
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                                
                                {/* Art Type */}
                                <div className="md:col-span-3">
                                    <FormField
                                        control={form.control}
                                        name="artType"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="flex items-center gap-2">
                                                    <Layout className="h-3.5 w-3.5 text-gray-500 dark:text-gray-400" />
                                                    {t('field.artType')}
                                                </FormLabel>
                                                <Select
                                                    onValueChange={field.onChange}
                                                    value={field.value}
                                                >
                                                    <FormControl>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder={t('placeholder.artType')} />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        <SelectItem value="digitalart">{t('artType.digitalart')}</SelectItem>
                                                        <SelectItem value="painting">{t('artType.painting')}</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                                <FormDescription>
                                                    {t('helper.artType')}
                                                </FormDescription>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                {/* Status */}
                                <div className="md:col-span-3">
                                    <FormField
                                        control={form.control}
                                        name="status"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="flex items-center gap-2">
                                                    <Clock className="h-3.5 w-3.5 text-gray-500 dark:text-gray-400" />
                                                    {t('field.status')}
                                                </FormLabel>
                                                <Select
                                                    onValueChange={field.onChange}
                                                    value={field.value}
                                                >
                                                    <FormControl>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder={t('placeholder.status')} />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        <SelectItem value="available">{t('status.available')}</SelectItem>
                                                        <SelectItem value="hidden">{t('status.hidden')}</SelectItem>
                                                        {artType === 'digitalart' && (
                                                            <SelectItem value="selling">{t('status.selling')}</SelectItem>
                                                        )}
                                                    </SelectContent>
                                                </Select>
                                                <FormDescription>
                                                    {artType === 'painting' ? t('helper.painting_status') : t('helper.status')}
                                                </FormDescription>
                                                <FormMessage/>
                                            </FormItem>
                                        )}
                                    />
                                </div>
                                
                                {/* Price - Integrated better with conditional rendering */}
                                {artType === 'digitalart' && (
                                    <div className="md:col-span-4">
                                        <FormField
                                            control={form.control}
                                            name="price"
                                            render={({ field: { value, onChange, ...field } }) => (
                                                <FormItem>
                                                    <FormLabel className="flex items-center gap-2">
                                                        {t('field.price')}
                                                    </FormLabel>
                                                    <div className="relative">
                                                        <div className="absolute left-0 inset-y-0 flex items-center pl-3 pointer-events-none">
                                                            <span className="text-gray-500 dark:text-gray-400 sm:text-sm"></span>
                                                        </div>
                                                        <FormControl>
                                                            <Input
                                                                type="number"
                                                                placeholder={t('placeholder.price')}
                                                                {...field}
                                                                value={value || ''}
                                                                onChange={(e) => {
                                                                    const val = e.target.value;
                                                                    onChange(val === '' ? '' : Number(val));
                                                                }}
                                                                min={0}
                                                                step="0.01"
                                                                className={`pl-7 ${status !== 'selling' ? 'text-gray-400 dark:text-gray-600' : ''}`}
                                                                disabled={status !== 'selling'}
                                                            />
                                                        </FormControl>
                                                        {status !== 'selling' && (
                                                            <div className="absolute inset-0 bg-gray-100/50 dark:bg-gray-800/50 rounded-md pointer-events-none" />
                                                        )}
                                                    </div>
                                                    <FormDescription className="flex items-center text-xs">
                                                        {status === 'selling' ? (
                                                            <span>{t('helper.price')}</span>
                                                        ) : (
                                                            <span className="text-gray-500 flex items-center gap-1">
                                                                <Info className="h-3 w-3" /> 
                                                                {locale === 'en' 
                                                                    ? "Select 'Selling' status to set price" 
                                                                    : "Chọn trạng thái 'Đang bán' để đặt giá"}
                                                            </span>
                                                        )}
                                                    </FormDescription>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                )}

                                {/* Image dimensions - More visible */}
                                {(form.getValues('width') || form.getValues('height')) && (
                                    <div className="md:col-span-4 md:col-start-9">
                                        <div className="flex items-center h-full">
                                            <div className="bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-3 w-full flex items-center justify-center gap-3">
                                                <ImageIcon className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                                                <span className="text-sm text-gray-700 dark:text-gray-300 font-medium">
                                                    {form.getValues('width')} × {form.getValues('height')} px
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Categories - Moved before content */}
                        <div className="p-6 space-y-6">
                            <h2 className="text-xl font-medium text-gray-900 dark:text-gray-100 mb-6 flex items-center">
                                <Tag className="h-5 w-5 mr-2 text-primary" />
                                {locale === 'en' ? 'Categories' : 'Thể loại'}
                            </h2>
                            
                            <FormField
                                control={form.control}
                                name="categories"
                                render={({ field }) => (
                                    <FormItem>
                                        {/* Custom category input with better button alignment */}
                                        <div className="space-y-4">
                                            <div className="flex flex-col sm:flex-row gap-3">
                                                <div className="relative flex-1">
                                                    {/* Custom input implementation with pill-shaped button */}
                                                    <div className="flex h-10 rounded-md border border-primary/20 bg-white dark:bg-gray-950 overflow-hidden focus-within:ring-1 focus-within:ring-primary/30 focus-within:border-primary transition-all duration-200">
                                                        {/* Icon container with consistent alignment */}
                                                        <div className="flex items-center justify-center pl-3 pr-2">
                                                            <Tag className="h-4 w-4 text-primary/70" />
                                                        </div>
                                                        
                                                        {/* Input field */}
                                                        <input
                                                            ref={categoryInputRef}
                                                            type="text"
                                                            placeholder={t('placeholder.categories')}
                                                            className="flex-1 h-full bg-transparent px-0 py-2 text-sm outline-none border-0 focus:outline-none focus:ring-0 text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500"
                                                            onKeyDown={handleKeyDown}
                                                        />
                                                        
                                                        {/* Pill-shaped Add button */}
                                                        <div className="pr-2 flex items-center">
                                                            <button
                                                                type="button"
                                                                className="flex items-center justify-center h-7 px-3 text-primary bg-primary/10 hover:bg-primary/20 hover:text-primary-600 transition-colors text-xs font-medium rounded-full"
                                                                onClick={handleAddCategory}
                                                            >
                                                                <Plus className="h-3 w-3 mr-1" />
                                                                <span>{locale === 'en' ? 'Add' : 'Thêm'}</span>
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                                
                                                {/* Enter hint with better styling */}
                                                <div className="hidden sm:flex items-center space-x-2 text-sm text-gray-500 bg-gray-50/80 dark:bg-gray-800/30 px-3 py-2 rounded-lg border border-gray-200/80 dark:border-gray-700/80">
                                                    <span>{locale === 'en' ? 'Press' : 'Nhấn'}</span>
                                                    <kbd className="px-2 py-1 bg-white dark:bg-gray-800 rounded text-xs font-semibold border border-gray-300/70 dark:border-gray-600 shadow-sm">Enter</kbd>
                                                    <span>{locale === 'en' ? 'to add' : 'để thêm'}</span>
                                                </div>
                                            </div>
                                            
                                            <FormDescription className="flex items-center gap-1.5 text-xs">
                                                <Info className="h-3.5 w-3.5 text-gray-400" />
                                                {t('helper.categories')}
                                            </FormDescription>
                                        </div>
                                        
                                        <div className="mt-6 grid grid-cols-1 md:grid-cols-12 gap-6">
                                            {/* Selected categories - Left side with improved visuals */}
                                            <div className="md:col-span-7">
                                                <h3 className="text-sm font-medium mb-3 flex items-center gap-2.5 text-gray-700 dark:text-gray-300">
                                                    <div className="flex h-5 w-5 items-center justify-center rounded-full bg-primary/10">
                                                        <Check className="h-3 w-3 text-primary" />
                                                    </div>
                                                    {locale === 'en' ? 'Selected Categories' : 'Thể loại đã chọn'}
                                                </h3>
                                                
                                                <div className="bg-gray-50/70 dark:bg-gray-800/30 border border-gray-200/70 dark:border-gray-700/50 rounded-lg p-4 min-h-[130px]">
                                                    <div className="flex flex-wrap gap-2">
                                                        {field.value.map((category, index) => (
                                                            <div
                                                                key={`${category}-${index}`}
                                                                className="group flex items-center bg-white dark:bg-gray-700 shadow-sm hover:shadow-md hover:bg-primary/5 dark:hover:bg-primary/10 px-3 py-1.5 rounded-full text-sm transition-all animate-in fade-in-0 slide-in-from-left-1 duration-200"
                                                            >
                                                                <span className="text-gray-700 dark:text-gray-200">{category}</span>
                                                                <button
                                                                    type="button"
                                                                    className="ml-1.5 opacity-60 group-hover:opacity-100 hover:text-red-500 dark:hover:text-red-400 focus:outline-none focus:ring-0 transition-opacity"
                                                                    onClick={() => handleRemoveCategory(index)}
                                                                >
                                                                    <X className="h-3.5 w-3.5" />
                                                                    <span className="sr-only">{t('button.remove')}</span>
                                                                </button>
                                                            </div>
                                                        ))}
                                                        
                                                        {field.value.length === 0 && (
                                                            <div className="flex items-center justify-center w-full h-[100px] text-gray-500 dark:text-gray-400">
                                                                <div className="text-center">
                                                                    <Tag className="h-6 w-6 mx-auto mb-2 opacity-40" />
                                                                    <p className="text-sm italic">
                                                                        {locale === 'en' ? 'No categories selected yet' : 'Chưa chọn thể loại nào'}
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                            
                                            {/* Available categories - Right side with visual improvements */}
                                            {categories.length > 0 && (
                                                <div className="md:col-span-5">
                                                    <h3 className="text-sm font-medium mb-3 flex items-center gap-2.5 text-gray-700 dark:text-gray-300">
                                                        <div className="flex h-5 w-5 items-center justify-center rounded-full bg-primary/10">
                                                            <ListFilter className="h-3 w-3 text-primary" />
                                                        </div>
                                                        {locale === 'en' ? 'Available Categories' : 'Thể loại có sẵn'}
                                                    </h3>
                                                    
                                                    <div className="bg-gray-50/70 dark:bg-gray-800/30 border border-gray-200/70 dark:border-gray-700/50 rounded-lg p-4 min-h-[130px]">
                                                        {categories.filter((cat: string) => !field.value.includes(cat)).length > 0 ? (
                                                            <div className="flex flex-wrap gap-2">
                                                                {categories
                                                                    .filter((cat: string) => !field.value.includes(cat))
                                                                    .map((category: string) => (
                                                                        <button
                                                                            key={category}
                                                                            type="button"
                                                                            className="flex items-center gap-1.5 bg-gray-100/70 dark:bg-gray-750/50 hover:bg-primary/10 dark:hover:bg-primary/20 hover:text-primary dark:hover:text-primary/80 px-3 py-1 rounded-full text-sm transition-colors"
                                                                            onClick={() => handleAddSuggestedCategory(category)}
                                                                        >
                                                                            <Plus className="h-3 w-3" />
                                                                            <span className="leading-tight">{category}</span>
                                                                        </button>
                                                                    ))}
                                                            </div>
                                                        ) : (
                                                            <div className="flex items-center justify-center h-[100px] text-gray-500 dark:text-gray-400">
                                                                <div className="text-center">
                                                                    <Check className="h-6 w-6 mx-auto mb-2 opacity-40" />
                                                                    <p className="text-sm italic">
                                                                        {locale === 'en' ? 'All available categories added' : 'Đã thêm tất cả thể loại có sẵn'}
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                        
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        
                        {/* Content Section - After categories */}
                        <div className="p-6 space-y-6">
                            <h2 className="text-xl font-medium text-gray-900 dark:text-gray-100 mb-6 flex items-center">
                                <FileText className="h-5 w-5 mr-2 text-primary" />
                                {locale === 'en' ? 'Content' : 'Nội dung'}
                            </h2>
                            
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                {/* Upload section with better visual cues */}
                                <div>
                                    <FormField
                                        control={form.control}
                                        name="imageUrl"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="flex items-center gap-2">
                                                    <ImageIcon className="h-3.5 w-3.5 text-gray-500 dark:text-gray-400" />
                                                    {t('field.image')}
                                                </FormLabel>
                                                
                                                <div className="space-y-3">
                                                    <div className={`border-2 ${isImageUploaded ? 'border-primary' : 'border-dashed'} rounded-lg overflow-hidden`}>
                                                        <FileUploader
                                                            accept={{ 'image/*': [] }}
                                                            maxFiles={1}
                                                            maxSize={10 * 1024 * 1024}
                                                            icon={<ImageIcon className="h-10 w-10 opacity-50" />}
                                                            onFileUpload={(files) => {
                                                                const fileRaw = files[0];
                                                                field.onChange(fileRaw.url);

                                                                setIsImageUploaded(true);
                                                                setPreviewUrl(fileRaw.url);
                                                                
                                                                if (files[1]!== undefined) {
                                                                    form.setValue('lowResUrl', files[1].url);
                                                                }
                                                                if (files[2]!== undefined) {
                                                                    form.setValue('watermarkUrl', files[2].url);
                                                                }

                                                                if (fileRaw.width !== undefined) {
                                                                    form.setValue('width', fileRaw.width.toString());
                                                                }
                                                                if (fileRaw.height !== undefined) {
                                                                    form.setValue('height', fileRaw.height.toString());
                                                                }
                                                            }}
                                                            artwork
                                                        />
                                                    </div>
                                                    
                                                    <div className="flex justify-between items-center text-sm">
                                                        <FormDescription>
                                                            {t('helper.image')}
                                                        </FormDescription>
                                                        
                                                        {isImageUploaded && (
                                                            <span className="text-green-600 dark:text-green-400 flex items-center gap-1.5">
                                                                <Check className="h-3.5 w-3.5" />
                                                                {locale === 'en' ? 'Uploaded' : 'Đã tải lên'}
                                                            </span>
                                                        )}
                                                    </div>
                                                    
                                                    {/* Preview button with better visual feedback */}
                                                    {previewUrl && (
                                                        <Button
                                                            type="button"
                                                            variant={showPreview ? "default" : "outline"}
                                                            className="w-full"
                                                            onClick={togglePreview}
                                                        >
                                                            <Eye className="mr-2 h-4 w-4" />
                                                            {showPreview ? t('upload.hidePreview') : t('upload.showPreview')}
                                                        </Button>
                                                    )}
                                                </div>
        
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                                
                                {/* Description - Wider for better text entry */}
                                <div className="md:col-span-2">
                                    <FormField
                                        control={form.control}
                                        name="description"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="flex items-center gap-2">
                                                    <FileText className="h-3.5 w-3.5 text-gray-500 dark:text-gray-400" />
                                                    {t('field.description')}
                                                </FormLabel>
                                                <FormControl>
                                                    <Textarea
                                                        placeholder={t('placeholder.description')}
                                                        className="min-h-[250px] resize-none"
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormDescription>
                                                    {t('helper.description')}
                                                </FormDescription>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            </div>
                        </div>
                        
                        {/* Footer */}
                        <div className="p-6 bg-gray-50 dark:bg-gray-800/50 flex flex-col sm:flex-row justify-between items-center gap-4">
                            <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center">
                                <Info className="h-4 w-4 mr-1.5" />
                                {locale === 'en' ? (
                                    <span>This form is also available in <span className="text-primary font-medium hover:underline cursor-pointer">Vietnamese</span></span>
                                ) : (
                                    <span>Biểu mẫu này cũng có sẵn bằng <span className="text-primary font-medium hover:underline cursor-pointer">Tiếng Anh</span></span>
                                )}
                            </div>
                            {/* Submit button with enhanced success animation */}
                            <Button
                                type="submit"
                                className="min-w-[140px] h-10 relative overflow-hidden"
                                disabled={mutation.isPending}
                            >
                                {mutation.isPending ? (
                                    <div className="flex items-center">
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        <span>{t('button.uploading')}</span>
                                    </div>
                                ) : (
                                    <div className="flex items-center">
                                        <ArrowUp className="mr-2 h-4 w-4" />
                                        <span>{t('button.upload')}</span>
                                    </div>
                                )}

                                {/* Success indicator with more animated effect */}
                                {mutation.isSuccess && (
                                    <motion.div 
                                        className="absolute inset-0 flex items-center justify-center bg-green-500 text-white"
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0 }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        <div className="flex items-center">
                                            <Check className="mr-2 h-4 w-4" />
                                            <span>{t('toast.successTitle')}</span>
                                        </div>
                                    </motion.div>
                                )}
                            </Button>
                        </div>
                    </form>
                </Form>
            </div>
        </div>
    );
}
