"use client";

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Form, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { updateBlogTagsAction } from './action';
import { useServerAction } from 'zsa-react';
import { toast } from '@/hooks/use-toast';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tag } from 'lucide-react';
import { getTags } from '@/service/blog-tag-service';
import { BlogTag } from '@/types/blog';

// Define proper types


interface EditTagsProps {
  blogId: string;
  currentTags?: string[];
}

interface TagFormValues {
  tags: string[];
}

export default function EditTags({ blogId, currentTags = [] }: EditTagsProps) {
  // Form setup with proper typing
  const tagsForm = useForm<TagFormValues>({
    defaultValues: {
      tags: currentTags,
    },
  });

  const [availableTags, setAvailableTags] = useState<BlogTag[]>([]);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [inputValue, setInputValue] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Server action with proper error handling
  const { execute: updateTags } = useServerAction(updateBlogTagsAction, {
    onSuccess: () => {
      toast({
        title: 'Success',
        description: 'Tags updated successfully',
        variant: 'success',
      });
      setIsOpen(false);
    },
    onError: ({ err }) => {
      toast({
        title: 'Error',
        description: err.message || 'Failed to update tags',
        variant: 'error',
      });
    },
  });

  // Fetch tags on component mount
  useEffect(() => {
    const fetchTags = async () => {
      try {
        setIsLoading(true);
        const res = await getTags();
        console.log('Fetched tags:', res);
        setAvailableTags(res.data?.tags || []);
      } catch {
        toast({
          title: 'Error',
          description: 'Failed to load tags',
          variant: 'error',
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    if (isOpen) {
      fetchTags();
    }
  }, [isOpen]);
  
  // Add new tag handler with improved validation
  const handleAddNewTag = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key !== 'Enter') return;
    event.preventDefault();
    
    const trimmedValue = inputValue.trim();
    if (trimmedValue === '') return;
    
    const currentTags = tagsForm.getValues('tags');
    
    // Prevent adding duplicate tags
    if (currentTags.includes(trimmedValue)) {
      toast({
        title: 'Warning',
        description: 'This tag already exists',
        variant: 'error',
      });
      return;
    }
    
    // Add new tag
    const newTags = [...currentTags, trimmedValue];
    tagsForm.setValue('tags', newTags);
    
    // Add to available tags if it doesn't exist
    if (!availableTags.some(tag => tag.name === trimmedValue)) {
      setAvailableTags(prev => [...prev, { _id: `new-${Date.now()}`, name: trimmedValue }]);
    }
    
    setInputValue('');
  };

  // Form submission handler
  const onSubmit = async (data: TagFormValues) => {
    try {
      await updateTags({
        blogId,
        tags: data.tags,
      });
    } catch (error) {
      console.error('Error updating tags:', error);
    }
  };

  // Remove tag handler
  const handleRemoveTag = (indexToRemove: number) => {
    const currentTags = tagsForm.getValues('tags');
    const newTags = currentTags.filter((_, index) => index !== indexToRemove);
    tagsForm.setValue('tags', newTags);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon" title="Edit Tags">
          <Tag className="h-4 w-4" /> 
        </Button>
      </DialogTrigger>
      <DialogContent className="min-h-72 max-h-full">
        <DialogHeader>
          <DialogTitle>Edit Tags</DialogTitle>
          <DialogDescription>Add or remove tags for this blog post.</DialogDescription>
        </DialogHeader>
        <Form {...tagsForm}>
          <form
            className="space-y-4 flex flex-col w-full"
            onSubmit={tagsForm.handleSubmit(onSubmit)}
          >
            <FormField
              control={tagsForm.control}
              name="tags"
              render={({ field }) => (
                <FormItem className="w-full flex flex-col">
                  <Command className="rounded-lg border shadow-md">
                    <CommandInput 
                      placeholder="Search or add new tags (press Enter to add)..."
                      value={inputValue}
                      onValueChange={setInputValue}
                      onKeyDown={handleAddNewTag}
                    />
                    <ScrollArea className="h-40">
                      <CommandList>
                        {isLoading ? (
                          <div className="py-6 text-center text-sm text-muted-foreground">
                            Loading tags...
                          </div>
                        ) : (
                          <>
                            <CommandEmpty>
                              {inputValue.trim() !== '' ? 
                                "No matching tags. Press Enter to add it." : 
                                "No tags available."}
                            </CommandEmpty>
                            <CommandGroup>
                              {availableTags
                                .filter(tag => !field.value.includes(tag.name))
                                .filter(tag => 
                                  tag.name.toLowerCase().includes(inputValue.toLowerCase())
                                )
                                .map((tag) => (
                                  <CommandItem
                                    key={tag._id}
                                    onSelect={() => {
                                      const newTags = [...field.value, tag.name];
                                      field.onChange(newTags);
                                    }}
                                  >
                                    {tag.name}
                                  </CommandItem>
                                ))}
                            </CommandGroup>
                          </>
                        )}
                      </CommandList>
                    </ScrollArea>
                  </Command>
                  
                  <FormLabel className="mt-4">Selected Tags</FormLabel>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {field.value.length === 0 ? (
                      <div className="text-muted-foreground text-sm">No tags selected</div>
                    ) : (
                      field.value.map((tag, index) => (
                        <div
                          key={index}
                          className="flex items-center gap-1 bg-secondary px-2 py-1 rounded"
                        >
                          <span>{tag}</span>
                          <button
                            type="button"
                            onClick={() => handleRemoveTag(index)}
                            className="text-sm hover:text-destructive"
                            aria-label={`Remove ${tag} tag`}
                          >
                            ×
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                </FormItem>
              )}
            />
            <div className="flex gap-2 justify-end">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setIsOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit">Save Changes</Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}