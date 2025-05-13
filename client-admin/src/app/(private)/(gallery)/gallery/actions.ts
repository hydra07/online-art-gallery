'use server';

import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { createGalleryTemplate, saveGalleryTemplate } from '@/service/gallery-service';
import { adminOnlyAction, authenticatedAction } from '@/lib/safe-action';

const vector3Schema = z.tuple([z.number(), z.number(), z.number()]);

// Base collider schema
const baseColliderSchema = z.object({
  position: vector3Schema,
  rotation: vector3Schema,
});

// Box collider specific schema
const boxColliderSchema = baseColliderSchema.extend({
  shape: z.literal('box'),
  args: vector3Schema
});

// Curved collider specific schema
const curvedColliderSchema = baseColliderSchema.extend({
  shape: z.literal('curved'),
  radius: z.number().positive(),
  height: z.number().positive(),
  segments: z.number().int().positive().optional().default(32),
  arc: z.number().min(0).max(Math.PI * 2).optional().default(Math.PI * 2)
});

// Combined collider schema using discriminated union
const customColliderSchema = z.discriminatedUnion('shape', [
  boxColliderSchema,
  curvedColliderSchema
]);

// Define validation schema for gallery template data
const galleryTemplateSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, "Name is required"),
  description: z.string().min(5, "Description must be at least 5 characters"),
  dimensions: z.object({
    xAxis: z.number().min(5, "Width must be at least 5 units"),
    yAxis: z.number().min(5, "Height must be at least 5 units"),
    zAxis: z.number().min(5, "Depth must be at least 5 units")
  }),
  wallThickness: z.number().min(0.1, "Wall thickness must be at least 0.1 units"),
  wallHeight: z.number().min(1, "Wall height must be at least 1 unit"),
  modelPath: z.string().min(1, "Model path is required"),
  modelScale: z.number().min(0.1, "Model scale must be greater than 0"),
  modelRotation: z.tuple([z.number(), z.number(), z.number()]),
  modelPosition: z.tuple([z.number(), z.number(), z.number()]),
  previewImage: z.string().min(1, "Preview image is required"),
  // planImage: z.string().min(1, "Plane image is required"),
  isPremium: z.boolean().default(false),
  isActive: z.boolean().default(true),
  customColliders: z.array(customColliderSchema).optional(),
  artworkPlacements: z.array(
    z.object({
      position: z.tuple([z.number(), z.number(), z.number()]),
      rotation: z.tuple([z.number(), z.number(), z.number()])
    })
  ).default([]),
});

export const createGalleryTemplateAction = adminOnlyAction
  .createServerAction()
  .input(galleryTemplateSchema)
  .handler(async ({ input, ctx }) => {
    const { user } = ctx;
    const templateData = { ...input,
      customColliders: input.customColliders || [],
      artworkPlacements: input.artworkPlacements || [],
     };
    
    const res = await createGalleryTemplate(user.accessToken, templateData);
    revalidatePath(`/gallery`);
    return res.data;
  });

export const saveGalleryTemplateAction = authenticatedAction
  .createServerAction()
  .input(galleryTemplateSchema)
  .handler(async ({ input, ctx }) => {
    try {

      const templateData = { ...input };

      const savedData = {
        ...templateData,
        customColliders: templateData.customColliders || [],
        artworkPlacements: templateData.artworkPlacements || [],
      };
      const res = await saveGalleryTemplate(ctx.user.accessToken, savedData);
      const { gallery } = res.data!;
      revalidatePath(`/gallery`);
      if (gallery) {
        revalidatePath(`/gallery/edit/${gallery._id}`);
        return gallery;
      }
    } catch (error) {
      console.error('Error saving gallery template:', error);
      throw new Error('Failed to save gallery template');
    }
  });