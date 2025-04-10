<template>
    <div class="app">
        <header>
            <div class="short_cut">
                <section>
                    ⌘/Ctrl + Z = 🔊
                </section>
                <section>
                    ⌘/Ctrl + X = ⬅️
                </section>
                <section>
                    ⌘/Ctrl + C = ⏮️
                </section>
                <section>
                    Tab = 👀
                </section>
            </div>
            <div class="translation">
                {{ current_word.translation }}
            </div>
        </header>
        <div class="phonetic">{{ current_word.phonetic }}</div>
        <div ref="inputs_container_ref" class="inputs_container ">
            <input v-for="(_, index) in current_word.content"
                v-bind:key="current_word.content.toString() + index.toString()" type="text"
                @input="(e) => handleTyping(e, index)">
        </div>
        <div class="status">
            <div class="time">时间:{{ convert_seconds_to_HMS(time) }}</div>
            <div class="current_word_number">当前: {{ count }}</div>
            <div class="total_number">总数: {{ words.length }}</div>
        </div>
        <dialog ref="ready_dialog_ref">
            <span @click="close_dialog">
                Press the Enter or Click here to begin.
            </span>
        </dialog>
    </div>
</template>

<script setup lang="ts">
import { words } from "@/data.ts";
import { computed, nextTick, onMounted, ref, type Ref } from "vue";
import typing_sound_url from "@/assets/short_type.mp3"

const time = ref(0)
const voice_basic_url = 'https://dict.youdao.com/dictvoice?type=0&audio='
const count = ref(0)
const inputs_container_ref: Ref<HTMLDivElement | null> = ref(null)
const ready_dialog_ref: Ref<HTMLDialogElement | null> = ref(null)
const current_word = computed(() => {
    return words[count.value]
})

const current_index = ref(0)

const playAudio = () => {
    const voiceUrl = current_word.value.voiceUrl ? current_word.value.voiceUrl : `${voice_basic_url}${current_word.value.content}`
    new Audio(voiceUrl).play()
}

const playTypingAudio = () => {
    new Audio(typing_sound_url).play()
}

const handleTyping = (event: Event, index: number) => {
    playTypingAudio()
    const current_input_element = (event.target as HTMLInputElement)
    let current_input_value = current_input_element.value
    current_input_value = current_input_value.toLocaleLowerCase()
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
        inputs_container_ref.value?.classList.add("animate__headShake", "animate__animated")
        setTimeout(() => {
            inputs_container_ref.value?.classList.remove("animate__headShake", "animate__animated")
            current_input_element.value = ""
        }, 300);
    }
}

const move_next_word = () => {
    localStorage.setItem('count', (count.value + 1).toString())
    if (count.value === words.length - 1) {
        alert("背完啦")
        count.value = 0
        nextTick(() => {
            focus_input(0)
            playAudio()
        })
        return
    }
    count.value += 1
    nextTick(() => {
        focus_input(0)
        playAudio()
    })
}

const move_to_word = (number: number) => {
    if (number < 0 || number >= words.length) return
    count.value = number
    localStorage.setItem('count', number.toString())
    nextTick(() => {
        focus_input(0)
        playAudio()
    })
}

const focus_input = (index: number) => {
    const index_input = inputs_container_ref.value?.children[index] as HTMLInputElement
    index_input.removeAttribute("disabled")
    index_input.focus()
    current_index.value = index
    disable_inputs_except(index)
}

const disable_inputs_except = (index: number) => {
    for (let i = 0; i < current_word.value.content.length; i++) {
        if (i !== index) {
            inputs_container_ref.value?.children[i].setAttribute("disabled", "disable")
        }
    }
}


const show_answer = () => {
    for (let i = 0; i < current_word.value.content.length; i++) {
        inputs_container_ref.value?.children[i].setAttribute("placeholder", current_word.value.content[i])
    }
}

const close_dialog = () => {
    ready_dialog_ref.value?.close()
    nextTick(() => {
        focus_input(0)
        playAudio()
    })
}

const convert_seconds_to_HMS = (seconds: number): string => {
    let H: number = 0
    let M: number = 0
    let S: number = seconds
    if (seconds >= 60) {
        M = Math.floor(seconds / 60)
        S = seconds % 60
    }
    if (M >= 60) {
        H = Math.floor(M / 60)
        M = M % 60
    }

    if (H === 0 && M === 0) {
        return `${S}s`
    }
    if (H === 0 && M !== 0) {
        return `${M}m:${S}s`
    }
    return `${H}h:${M}m:${S}s`
}

const bindKeys = () => {
    window.addEventListener('keydown', (event) => {
        // combined key
        if ((event.metaKey || event.ctrlKey) && event.key === 'z') {
            event.preventDefault();
            playAudio()
            return
        } else if ((event.metaKey || event.ctrlKey) && event.key === 'x') {
            event.preventDefault();
            move_to_word(count.value - 1)
            return
        } else if ((event.metaKey || event.ctrlKey) && event.key === 'c') {
            event.preventDefault();
            move_to_word(0)
            return
        }

        // single key
        switch (event.key) {
            case "Enter":
                if (ready_dialog_ref.value?.hasAttribute("open")) {
                    close_dialog()
                }
                break;
            case "Tab":
                event.preventDefault()
                show_answer()
            default:
                break;
        }
    });
}

onMounted(() => {
    if (localStorage.getItem('count')) {
        count.value = Number(localStorage.getItem('count'))
    }
    setInterval(() => {
        time.value += 1
        focus_input(current_index.value)
    }, 1000);
    ready_dialog_ref.value?.show()
    bindKeys()
})
</script>

<style scoped>
/* app */
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

/* header */
header {
    position: relative;
}

header .translation {
    font-size: larger;
    font-family: "Kalam", cursive;
    font-weight: 400;
    font-style: normal;
}

header .short_cut {
    position: absolute;
    left: -37vw;
    /* top: 5vh; */
    width: 150px;

    display: flex;
    flex-direction: column;
    gap: 10px;

    color: gray;

}

/* phonetic */
.app .phonetic {
    font-size: small;
}

/* inputs container */
.app .inputs_container {
    width: 100%;

    display: flex;
    align-content: center;
    justify-content: center;

    flex-wrap: wrap;

    gap: 20px;
}

.inputs_container input {
    width: 70px;
    box-sizing: border-box;
    border: 0px;
    border-bottom: 1px black solid;
    padding: 10px;
    background-color: white;

    outline: none;
    font-size: 50px;
    letter-spacing: 10px;
    text-align: center;

    font-family: "Kalam", cursive;
    font-weight: 600;
    font-style: normal;
}

.inputs_container input::placeholder {
    color: gainsboro;
}


.inputs_container input.success {
    color: lightblue;
    border: 0px;
}

.inputs_container input.failed {
    color: lightcoral;
}

/* dialog */
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
    /* line-height: 100vh; */
    padding-top: 40vh;
    font-family: "Kalam", cursive;
    font-size: 50px;
    font-weight: 400;
    font-style: normal;
}

dialog span:hover {
    cursor: pointer;
}

/* status */
.app .status {
    display: flex;
    gap: 20px;
    color: gray;
    margin-top: 100px;
}

.status .time {}

.status .current_word_number {}

.status .total_number {}
</style>