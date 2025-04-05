<template>
    <div class="app">
        <header class="translation">{{ current_word.translation }}</header>
        <div class="inputs_container">

        </div>
        <input v-model="input_content" ref="input" type="text" @input="handleType" />
    </div>
</template>

<script setup lang="ts">
import { words } from "@/data.ts";
import { computed, onMounted, ref, type Ref } from "vue";

const count = ref(0)
const index = ref(0)
const input_content = ref("")
const input: Ref<HTMLInputElement | null> = ref(null)
const current_word = computed(() => {
    return words[count.value]
})

const handleType = () => {
    index.value = (input_content.value.length - 1 === -1) ? 0 : input_content.value.length - 1
    if (current_word.value.content[index.value] === input_content.value[index.value]) {
        if (index.value === current_word.value.content.length - 1) {
            setTimeout(() => {
                move_next()
            }, 300);
        }
    } else {
        setTimeout(() => {
            input_content.value = input_content.value.substring(0, input_content.value.length - 1)
        }, 300);
    }
}

const move_next = () => {
    count.value += 1
    index.value = 0
    input_content.value = ""
}

onMounted(() => {
    input.value?.focus()
})
</script>

<style scoped>
.app {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 30px;
    width: 80%;
    margin: 0 auto;
    margin-top: 300px;
}

.app header {
    text-align: center;
    font-size: large;
}

.app input {
    width: 30%;
    height: 50px;
    font-size: larger;

    letter-spacing: 10px;

}
</style>