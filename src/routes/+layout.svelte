<script lang="ts">
	import '../app.css';
	
	let { children } = $props();

	import { Navbar, NavLi, NavUl, NavHamburger, Footer } from 'flowbite-svelte';

	import { DarkMode } from 'flowbite-svelte';
</script>

<svelte:head>
	<title>OTP-Upload</title>
</svelte:head>


<Navbar color="none">
	<NavUl>
	  <NavLi href="/">Home</NavLi>
	  <NavLi href="/files">Files (TODO)</NavLi>
	</NavUl>
</Navbar>

<div class="relative isolate px-6 pt-3 lg:px-8 flex flex-col w-full text-center items-center justify-center">
	{@render children()}
</div>

<Footer class="fixed bottom-0 w-full flex items-end justify-end mb-3">

	<div class="flex flex-col items-end justify-end">
		<p class="dark:text-gray-100 text-xs font-extralight mb-1">
			made by <a class="underline underline-offset-2" href="https://drowsy.me">sleepy</a>
		</p>
		<p class="dark:text-gray-100 text-xs font-extralight">
			<i>frontend is not my passion</i>
		</p>
	</div>

	<div class="mx-3">
		<DarkMode size="md" />
	</div>
</Footer>