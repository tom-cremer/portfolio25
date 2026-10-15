// Apparition au scroll : tout élément [data-reveal] reçoit .is-revealed quand il entre dans le viewport.
// Variantes (CSS) : data-reveal="up" (défaut) | "fade" | "left" | "right" | "scale"
// data-reveal-delay="150" : délai en ms
// data-reveal-stagger sur un parent : ses enfants révélés en même temps se suivent (80 ms, ou la valeur donnée)

const STAGGER_STEP = 80;

let observer: IntersectionObserver | undefined;

function reveal(element: HTMLElement, delay: number) {
    if (delay > 0) {
        element.style.transitionDelay = `${delay}ms`;
        // Le délai ne doit pas ralentir d'éventuelles transitions ultérieures (hover, etc.)
        const clear = (event: TransitionEvent) => {
            if (event.target !== element) return;
            element.style.removeProperty('transition-delay');
            element.removeEventListener('transitionend', clear);
        };
        element.addEventListener('transitionend', clear);
    }
    element.classList.add('is-revealed');
}

function handleEntries(entries: IntersectionObserverEntry[]) {
    // Les éléments d'un même parent stagger qui entrent ensemble sont décalés dans l'ordre du DOM
    const staggerCount = new Map<Element, number>();
    entries
        .filter((entry) => entry.isIntersecting)
        .map((entry) => entry.target as HTMLElement)
        .sort((a, b) => (a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1))
        .forEach((element) => {
            observer?.unobserve(element);
            let delay = Number(element.dataset.revealDelay) || 0;
            const group = element.parentElement;
            if (group?.hasAttribute('data-reveal-stagger')) {
                const index = staggerCount.get(group) ?? 0;
                staggerCount.set(group, index + 1);
                delay += index * (Number(group.dataset.revealStagger) || STAGGER_STEP);
            }
            reveal(element, delay);
        });
}

export function initReveal(root: ParentNode = document) {
    const elements = [...root.querySelectorAll<HTMLElement>('[data-reveal]:not([data-reveal-bound])')];
    const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

    elements.forEach((element) => {
        element.dataset.revealBound = '';
        if (reduceMotion || !('IntersectionObserver' in window)) {
            element.classList.add('is-revealed');
            return;
        }
        observer ??= new IntersectionObserver(handleEntries, {threshold: 0, rootMargin: '0px 0px -10% 0px'});
        observer.observe(element);
    });
}
