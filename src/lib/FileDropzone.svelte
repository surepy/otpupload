<script lang="ts">
    let { files = $bindable<File[]>([]) }: { files?: File[] } = $props();

    let dragover = $state(false);
    let inputEl: HTMLInputElement;

    function handleDrop(e: DragEvent) {
        e.preventDefault();
        dragover = false;
        if (e.dataTransfer?.files) {
            addFiles(e.dataTransfer.files);
        }
    }

    function handleDragOver(e: DragEvent) {
        e.preventDefault();
        dragover = true;
    }

    function handleDragLeave() {
        dragover = false;
    }

    function handleInputChange(e: Event) {
        const input = e.target as HTMLInputElement;
        if (input.files) {
            addFiles(input.files);
        }
        input.value = "";
    }

    function addFiles(newFiles: FileList) {
        const existingNames = new Set(files.map((f) => f.name));
        const toAdd = Array.from(newFiles).filter((f) => !existingNames.has(f.name));
        files = [...files, ...toAdd];
    }

    function removeFile(index: number) {
        files = files.filter((_, i) => i !== index);
    }

    function formatSize(bytes: number): string {
         // if you're uploading a terabyte of data over this, there is probablly something wrong with you
        const byteFormat = [
            "", "K", "M", "G", "T", "E", "Z"
        ]
        let byte_prefix_idx = 0;
        
        while (bytes > 1024 && byte_prefix_idx < byteFormat.length) {
            bytes /= 1024;
            ++byte_prefix_idx;
        }

        return `${bytes.toFixed(2)} ${byteFormat[byte_prefix_idx]}B`
    }

    function getPreviewUrl(file: File): string | null {
        if (file.type.startsWith("image/")) {
            return URL.createObjectURL(file);
        }
        return null;
    }

    function clearAll() {
        files = [];
    }
</script>

<div class="w-full">
    <!-- Drop Zone -->
    <button
        type="button"
        class="w-full border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
               {dragover
            ? 'border-blue-500 bg-blue-500/10'
            : 'border-gray-600 hover:border-gray-500 dark:bg-transparent bg-gray-300/50'}"
        ondrop={handleDrop}
        ondragover={handleDragOver}
        ondragleave={handleDragLeave}
        onclick={() => inputEl.click()}
    >
        <svg
            class="mx-auto h-12 w-12 text-black dark:text-gray-400 mb-3"
            stroke="currentColor"
            fill="none"
            viewBox="0 0 48 48"
        >
            <path
                d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
            />
        </svg>
        <p class="dark:text-gray-300 text-black font-medium">Drop files here or click to browse</p>
        <p class="dark:text-gray-500 text-black text-sm mt-1">Supports multiple files</p>
    </button>

    <input
        bind:this={inputEl}
        type="file"
        multiple
        class="hidden"
        onchange={handleInputChange}
    />

    <!-- File List -->
    {#if files.length > 0}
        <div class="mt-4 space-y-2">
            <div class="flex justify-between items-center mb-2">
                <span class="text-gray-400 text-sm">{files.length} file{files.length > 1 ? "s" : ""} selected</span>
                <button
                    type="button"
                    class="text-red-400 hover:text-red-300 text-sm"
                    onclick={clearAll}
                >
                    Clear all
                </button>
            </div>

            {#each files as file, i}
                {@const previewUrl = getPreviewUrl(file)}
                <div class="flex items-center gap-3 bg-gray-800 rounded-lg p-3">
                    <!-- Thumbnail or Icon -->
                    <div class="w-12 h-12 shrink-0 rounded bg-gray-700 flex items-center justify-center overflow-hidden">
                        {#if previewUrl}
                            <img src={previewUrl} alt="" class="w-full h-full object-cover" />
                        {:else}
                            <svg class="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                        {/if}
                    </div>

                    <!-- File Info -->
                    <div class="flex-1 min-w-0">
                        <p class="text-gray-200 text-sm font-medium truncate">{file.name}</p>
                        <p class="text-gray-500 text-xs">{formatSize(file.size)}</p>
                    </div>

                    <!-- Remove Button -->
                    <button
                        title="remove file"
                        type="button"
                        class="text-gray-400 hover:text-red-400 p-1 transition-colors"
                        onclick={() => removeFile(i)}
                    >
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
            {/each}
        </div>
    {/if}
</div>
