import { Alert, AlertIcon, AlertTitle } from '@/components/ui/alert';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
  FormLabel,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';
import { Check, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button.tsx";
import { useEffect, useState } from 'react';
import { fetchNewsletterCategories, subscribeToNewsletter, type NewsletterCategory } from '@/services/NewsletterService';
import { Checkbox } from '@/components/ui/checkbox';

const FormSchema = z.object({
  email: z.string().email('Please enter a valid email address.'),
  categories: z.array(z.string()).min(1, 'Please select at least one category.'),
});

export default function NewsLetter() {
  const [categories, setCategories] = useState<NewsletterCategory[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetchingCategories, setFetchingCategories] = useState(true);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: { 
      email: '',
      categories: []
    },
  });

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const data = await fetchNewsletterCategories();
        setCategories(data);
      } catch (error) {
        console.error('Failed to load newsletter categories', error);
      } finally {
        setFetchingCategories(false);
      }
    };
    loadCategories();
  }, []);

  const onSubmit = async (data: z.infer<typeof FormSchema>) => {
    setLoading(true);
    try {
      await subscribeToNewsletter(data.email, data.categories);
      toast.custom((t) => (
        <Alert variant="mono" icon="primary" onClose={() => toast.dismiss(t)}>
          <AlertIcon>
            <Check />
          </AlertIcon>
          <AlertTitle>You have successfully subscribed to our newsletter!</AlertTitle>
        </Alert>
      ));
      form.reset();
    } catch (error: any) {
      toast.error(error.message || 'Failed to subscribe. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="Email address"
                    className="placeholder:text-gray-500 h-12 text-gray-700 bg-white rounded-full border-gray-200 focus:border-[#FF005C] focus:ring-[#FF005C]" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-gray-700 ml-1">Select Interests:</h4>
            {fetchingCategories ? (
              <div className="flex items-center space-x-2 text-gray-400 text-sm italic">
                <Loader2 className="h-4 w-4 animate-spin text-[#FF005C]" />
                <span>Loading categories...</span>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                {categories.map((category) => (
                  <FormField
                    key={category.id}
                    control={form.control}
                    name="categories"
                    render={({ field }) => {
                      return (
                        <FormItem
                          key={category.id}
                          className="flex flex-row items-start space-x-3 space-y-0 bg-white/50 p-2 rounded-lg border border-transparent hover:border-gray-100 transition-all"
                        >
                          <FormControl>
                            <Checkbox
                              checked={field.value?.includes(category.code)}
                              onCheckedChange={(checked) => {
                                return checked
                                  ? field.onChange([...field.value, category.code])
                                  : field.onChange(
                                      field.value?.filter(
                                        (value) => value !== category.code
                                      )
                                    )
                              }}
                            />
                          </FormControl>
                          <FormLabel className="text-sm font-medium leading-none cursor-pointer">
                            {category.name}
                          </FormLabel>
                        </FormItem>
                      )
                    }}
                  />
                ))}
              </div>
            )}
            <FormMessage />
            {form.formState.errors.categories && (
               <p className="text-sm font-medium text-destructive">{form.formState.errors.categories.message}</p>
            )}
          </div>

          <Button 
            disabled={loading || fetchingCategories}
            className="font-bold font-poppins text-lg shadow-lg border-none w-full bg-[#FF005C] hover:bg-[#D9004E] text-white h-12 rounded-full transition-all active:scale-[0.98]"
          >
            {loading ? <Loader2 className="h-5 w-5 animate-spin mr-2" /> : null}
            {loading ? 'Subscribing...' : 'Subscribe Now'}
          </Button>
        </form>
      </Form>
    </div>
  );
}
