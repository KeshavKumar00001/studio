'use server';

/**
 * @fileOverview Recommends medicines based on the products in the user's cart.
 * 
 * - getProductRecommendations - A function that handles the retrieval of product recommendations.
 * - ProductRecommendationsInput - The input type for the getProductRecommendations function.
 * - ProductRecommendationsOutput - The return type for the getProductRecommendations function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ProductSchema = z.object({
  name: z.string().describe('The name of the product.'),
  category: z.string().describe('The category of the product (e.g., Ayurvedic, Homeopathic, Supplements, Allopathic).'),
  attributes: z.array(z.string()).describe('A list of attributes or properties of the product.'),
});

export type Product = z.infer<typeof ProductSchema>;

const ProductRecommendationsInputSchema = z.object({
  cartContents: z.array(ProductSchema).describe('The list of products currently in the user\'s shopping cart.'),
});
export type ProductRecommendationsInput = z.infer<typeof ProductRecommendationsInputSchema>;

const ProductRecommendationsOutputSchema = z.object({
  recommendedProducts: z.array(ProductSchema).describe('A list of recommended products based on the cart contents.'),
});
export type ProductRecommendationsOutput = z.infer<typeof ProductRecommendationsOutputSchema>;

export async function getProductRecommendations(input: ProductRecommendationsInput): Promise<ProductRecommendationsOutput> {
  return productRecommendationsFlow(input);
}

const productRecommendationsPrompt = ai.definePrompt({
  name: 'productRecommendationsPrompt',
  input: {schema: ProductRecommendationsInputSchema},
  output: {schema: ProductRecommendationsOutputSchema},
  prompt: `You are a helpful assistant that recommends medicines to users based on the products in their cart.

  Consider the type of medicine and attributes of the medicines already in the cart when selecting recommendations.

  Here are the products currently in the cart:
  {{#each cartContents}}
  - Name: {{name}}, Category: {{category}}, Attributes: {{attributes}}
  {{/each}}

  Recommend other medicines that the user might be interested in, providing the name, category, and attributes for each. Return the data in JSON format.
  `,
});

const productRecommendationsFlow = ai.defineFlow(
  {
    name: 'productRecommendationsFlow',
    inputSchema: ProductRecommendationsInputSchema,
    outputSchema: ProductRecommendationsOutputSchema,
  },
  async input => {
    const {output} = await productRecommendationsPrompt(input);
    return output!;
  }
);
