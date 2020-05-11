<template>
    <div v-if="scores.length" class="mb-3">
        <h5 class="mb-2">Noty</h5>

        <div v-for="score in scores">
            <score :score="score"></score>
        </div>
    </div>
</template>

<script>
import Score from '~/pages/song/components/Score/Score';
import { clone } from 'lodash';

export default {
    name: 'Scores',
    components: { Score },
    props: ['song'],

    methods: {
        fileTypeConvert: function(type) {
            const mapping = {
                1: 8,
                2: 9,
                3: 4,
                4: 7
            };

            return mapping[type] || type;
        }
    },

    computed: {
        scores: {
            get() {
                // File => File with unified type
                const mapFile = file => {
                    const copy = clone(file);
                    copy.type = this.fileTypeConvert(copy.type);
                    return copy;
                };

                const filteredExternals = this.song.externals.filter(ext =>
                    [4, 8, 9].includes(ext.type)
                );
                const filteredFiles = this.song.files
                    .map(mapFile)
                    .filter(file => [4, 8, 9].includes(file.type));

                return [...filteredExternals, ...filteredFiles];
            }
        }
    }
};
</script>

<style scoped></style>
