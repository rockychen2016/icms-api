<template>
    <h1>hello</h1>
    <div>cms:</div>
    <div v-if="data != undefined">{{ JSON.stringify(data) }}</div>

</template>

<script lang="ts" setup>
const { data } = await useAsyncData('website', async () => {
    if (import.meta.server) {
        const { ICMSServer } = await import('@icms-api/server');
        const icms = new ICMSServer();
        const res = await icms.loadWebsite();
        return res;
    }
    return {data:"test"};
});

</script>
