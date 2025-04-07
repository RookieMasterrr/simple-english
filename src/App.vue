<template>
    <div class="app">
        <header>{{ current_word.translation }}</header>
        <div ref="inputs_container_ref" class="inputs_container">
            <input v-for="(_, index) in current_word.content" v-bind:key="current_word.id.toString() + index.toString()"
                type="text" @input="(e) => handleTyping(e, index)">
        </div>
        <!-- <button @click="playAudio">播放</button> -->
        <dialog ref="ready_dialog_ref">
            <span @click="close_dialog">
                Are you ready? Press the Enter or Click here to begin.
            </span>
        </dialog>
    </div>
</template>

<script setup lang="ts">
import { words } from "@/data.ts";
import { computed, nextTick, onMounted, ref, type Ref } from "vue";

const voice_basic_url = 'https://dict.youdao.com/dictvoice?type=0&audio='
const count = ref(0)
const inputs_container_ref: Ref<HTMLDivElement | null> = ref(null)
const ready_dialog_ref: Ref<HTMLDialogElement | null> = ref(null)
const current_word = computed(() => {
    return words[count.value]
})

const playAudio = () => {
    const voiceUrl = current_word.value.voiceUrl ? current_word.value.voiceUrl : `${voice_basic_url}${current_word.value.content}`
    new Audio(voiceUrl).play()
}

const handleTyping = (event: Event, index: number) => {
    const current_input_element = (event.target as HTMLInputElement)
    const current_input_value = current_input_element.value
    const wanted_value = current_word.value.content[index]
    if (current_input_value === wanted_value) {
        if (index === current_word.value.content.length - 1) {
            current_input_element.setAttribute("class", "success")
            setTimeout(() => {
                move_next_word()
            }, 300);
        } else {
            current_input_element.setAttribute("class", "success")
            focus_input(index + 1)
        }
    } else {
        current_input_element.setAttribute("class", "failed")
        setTimeout(() => {
            current_input_element.value = ""
        }, 300);
    }

}

const move_next_word = () => {
    if (count.value === words.length - 1) {
        alert("背完啦")
        count.value = 0
        nextTick(() => {
            focus_input(0)
        })
        return
    }
    count.value += 1
    nextTick(() => {
        focus_input(0)
        playAudio()
    })
}

const focus_input = (index: number) => {
    const index_input = inputs_container_ref.value?.children[index] as HTMLInputElement
    index_input.removeAttribute("disabled")
    index_input.focus()
    disable_inputs_except(index)
}

const disable_inputs_except = (index: number) => {
    for (let i = 0; i < current_word.value.content.length; i++) {
        if (i !== index) {
            inputs_container_ref.value?.children[i].setAttribute("disabled", "disable")
        }
    }
}

const able_input = (index: number) => {
    inputs_container_ref.value?.children[index].setAttribute("disabled", "false")
}


const close_dialog = () => {
    ready_dialog_ref.value?.close()
    setTimeout(() => {
        focus_input(0)
        playAudio()
    }, 500);
}

const bindKeys = () => {
    window.addEventListener('keydown', (event) => {
        switch (event.key) {
            case "Enter":
                if (ready_dialog_ref.value?.hasAttribute("open")) {
                    close_dialog()
                }
                break;
            case "Tab":
                event.preventDefault()
            default:
                break;
        }
    });
}

onMounted(() => {
    ready_dialog_ref.value?.show()
    bindKeys()
})
</script>

<style scoped>
.app {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 30px;
    width: 100%;
    margin: 0 auto;
    margin-top: 20%;
}

.app header {
    font-size: large;
}

.app .inputs_container {
    width: 100%;
    height: 50px;

    display: flex;
    align-content: center;
    justify-content: center;
    gap: 20px;
}

.app .inputs_container input {
    box-sizing: border-box;
    border: 0px;
    border-bottom: 1px black solid;
    outline: none;
    padding: 10px;
    background-color: white;
    width: 50px;

    font-size: larger;
    letter-spacing: 10px;
    text-align: center;

}

.app .inputs_container input.success {
    color: blue;
    border: 0px;
}

.app .inputs_container input.failed {
    color: red;
}

dialog {
    padding: 0;
    margin: 0;
    border: 0;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    box-sizing: border-box;
    width: 100%;
    height: 100%;
    text-align: center;
    line-height: 100vh;
}

dialog span:hover {
    cursor: pointer;
}
</style>