<script setup>
defineEmits(['toggle']);
</script>

<template>
    <div class="toggle-container">
        <label class="toggle-switch">
            <span class="switch-control">
                <input type="checkbox" id="toggleInput" @change="$emit('toggle', $event.target.checked)">
                <span class="slider" aria-hidden="true"></span>
            </span>
            <span class="toggle-label">{{ $t('topRestaurantSwitcher.label') }}</span>
        </label>
    </div>
</template>

<style scoped>
.toggle-container {
    display: flex;
    justify-content: flex-end;
    padding: 0 1.25rem;
}

.toggle-switch {
    display: inline-flex;
    align-items: center;
    gap: 0.75rem;
    cursor: pointer;
}

@media (max-width: 600px) {
    .toggle-container {
        justify-content: center;
        padding: 0 1rem;
        margin-bottom: 0.5rem;
    }
}

.switch-control {
    position: relative;
    display: inline-block;
    flex: 0 0 50px;
    width: 50px;
    height: 26px;
}

.switch-control input {
    position: absolute;
    z-index: 1;
    inset: 0;
    width: 100%;
    height: 100%;
    margin: 0;
    opacity: 0;
    cursor: pointer;
}

.slider {
    position: absolute;
    inset: 0;
    background-color: #52635b;
    border-radius: 34px;
    transition: background-color 0.3s ease;
}

.slider::before {
    content: "";
    position: absolute;
    height: 20px;
    width: 20px;
    left: 3px;
    bottom: 3px;
    background-color: white;
    border-radius: 50%;
    transition: transform 0.3s ease;
}

.switch-control input:checked+.slider {
    background-color: #287d68;
}

.switch-control input:checked+.slider::before {
    transform: translateX(24px);
}

.switch-control input:focus-visible+.slider {
    outline: 2px solid #2196f3;
    outline-offset: 2px;
}
</style>