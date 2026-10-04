// Nombre de positions atteignables par un slider Glide « bound » : une puce par position.
export function reachablePositions(slides: number, perView: number): number {
    return Math.max(1, slides - Math.floor(perView) + 1);
}
