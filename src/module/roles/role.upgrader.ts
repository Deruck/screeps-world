export class UpgraderMethods {
    static run(creep: Creep, source: Source, reusePath: number): void {
        creep.harvestToUpgrade(source, {
            visualizePathStyle: { stroke: '#ffffff' },
            reusePath: reusePath
        })
    }
}