import CustomButton from '@/components/CustomButton'
import CustomInput from '@/components/CustomInput'
import { signIn } from "@/lib/appwrite"
import { Link, router } from 'expo-router'
import React, { useState } from 'react'
import { Alert, Text, View } from 'react-native'

const SignIn = () => {
  // to make the sign in functional, we use a useState snippet.
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState({email: '', password: ''});

  const submit = async () => {
    // Destructuring the form object to get the email and password so that we dont have to repeat 'form'.

    const { email, password } = form;

    // after destructuring, we dont have to write it like this:
    // if(!form.email || !form.password) return Alert.alert('Error', 'Please enter valid email address and password');
    // instead we can write it like this:
    if(!email || !password) return Alert.alert('Error', 'Please enter valid email address and password');

    setIsSubmitting(true);

    try {
      // Here you would typically call your sign-in API
      // Call appwrite Sign In function
      // we dont have to call the name because we are not creating a new user, we are signing in an existing user.
      await signIn({ email, password });
      
      router.replace('/'); 
      // Redirect to home page after successful sign-in
    } catch (error: any) {
      Alert.alert('Error', error.message);
    } finally {
      setIsSubmitting(false);
      // finally whether the request was successful or not, we set isSubmitting to false which will stop the submitting process.
    }
  }

  return (
    <View className="gap-10 bg-white rounded-lg p-5 mt-5">
      <CustomInput
        placeholder="Enter your email"
        value={form.email}
        onChangeText={(text) => setForm( (prev)=> ({ ...prev, email: text }))}
        label="Email"
        keyboardType="email-address"
      />
      <CustomInput
        placeholder="Enter your password"
        value={form.password}
        onChangeText={(text) => setForm( (prev)=> ({ ...prev, password: text }))}
        label="Password"
        secureTextEntry={true}
      />
      <CustomButton
        title="Sign In"
        isLoading={isSubmitting}
        onPress={submit}
      />

      <View className="flex justify-center mt-5 flex-row gap-2">
        <Text className="base-regular text-gray-100">
          Don&apos;t have an account?
        </Text>
        <Link href="/sign-up" className="base-bold text-primary">
        Sign Up
        </Link>
      </View>
    </View>
  )
}

export default SignIn