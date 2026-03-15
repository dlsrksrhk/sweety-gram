'use client'

import {useForm} from 'react-hook-form'
import {zodResolver} from '@hookform/resolvers/zod'
import Link from 'next/link'
import {registerSchema, type RegisterFormData} from '@/lib/schemas/auth-schema'
import {useRegister} from '@/lib/hooks/use-auth'
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form'
import {Input} from '@/components/ui/input'
import {Button} from '@/components/ui/button'

export default function RegisterForm() {
    const {mutate: registerMutate, isPending, error} = useRegister()

    const form = useForm<RegisterFormData>({
        resolver: zodResolver(registerSchema),
        defaultValues: {username: '', email: '', password: ''},
        mode: 'onChange',
    })

    function onSubmit(data: RegisterFormData) {
        registerMutate(data)
    }

    return (
        <div className="flex flex-col gap-6">
            <div className="text-center">
                <h1 className="text-2xl font-bold">회원가입</h1>
                <p className="mt-1 text-sm text-muted-foreground">새 계정을 만드세요</p>
            </div>

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
                    {error && (
                        <p className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
                            {error.message}
                        </p>
                    )}

                    <FormField
                        control={form.control}
                        name="username"
                        render={({field}) => (
                            <FormItem>
                                <FormLabel>사용자명</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="영문, 숫자, 언더스코어 (3~20자)"
                                        autoComplete="username"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage/>
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="email"
                        render={({field}) => (
                            <FormItem>
                                <FormLabel>이메일</FormLabel>
                                <FormControl>
                                    <Input
                                        type="email"
                                        placeholder="name@example.com"
                                        autoComplete="email"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage/>
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="password"
                        render={({field}) => (
                            <FormItem>
                                <FormLabel>비밀번호</FormLabel>
                                <FormControl>
                                    <Input
                                        type="password"
                                        placeholder="최소 8자 이상"
                                        autoComplete="new-password"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage/>
                            </FormItem>
                        )}
                    />

                    <Button type="submit" className="w-full" disabled={isPending}>
                        {isPending ? '가입 중...' : '회원가입'}
                    </Button>
                </form>
            </Form>

            <p className="text-center text-sm text-muted-foreground">
                이미 계정이 있으신가요?{' '}
                <Link href="/login" className="font-medium text-primary hover:underline">
                    로그인
                </Link>
            </p>
        </div>
    )
}
