import { JsonValue } from './types';

export function buildDom(value: JsonValue): HTMLElement {
    const elem = document.createElement('div');
    const blockInner = document.createElement('div');
    blockInner.className = 'blockInner';

    if (value === null) {
        // Null
        elem.className = 'null';
        elem.appendChild(document.createTextNode('null'));
    } else if (Array.isArray(value)) {
        // Array
        const length = value.length;
        elem.className = 'array';

        if (length > 0) {
            elem.classList.add('collapsible');
            const expander = document.createElement('div');
            expander.className = 'e';
            elem.appendChild(expander);

            value.forEach((v, i) => {
                blockInner.appendChild(buildDom(v));
                if (i < length - 1) {
                    blockInner.appendChild(document.createTextNode(','));
                }
            });
        }

        elem.insertBefore(document.createTextNode('['), elem.firstChild || null);
        elem.appendChild(blockInner);
        elem.appendChild(document.createTextNode(']'));
    } else if (typeof value === 'object') {
        // Object
        const keys = Object.keys(value);
        elem.className = 'object';

        if (keys.length > 0) {
            elem.classList.add('collapsible');
            const expander = document.createElement('div');
            expander.className = 'e';
            elem.appendChild(expander);

            keys.forEach((k, i) => {
                const keyElem = document.createElement('span');
                keyElem.className = 'key';
                keyElem.textContent = `"${k}": `;
                blockInner.appendChild(keyElem);
                blockInner.appendChild(buildDom(value[k]));
                if (i < keys.length - 1) {
                    blockInner.appendChild(document.createTextNode(','));
                }
            });
        }

        elem.insertBefore(document.createTextNode('{'), elem.firstChild || null);
        elem.appendChild(blockInner);
        elem.appendChild(document.createTextNode('}'));
    } else if (typeof value === 'string') {
        // String
        elem.className = 'string';
        elem.appendChild(document.createTextNode(`"${value.replace(/"/g, '\\"')}"`));
    } else if (typeof value === 'number') {
        // Number
        elem.className = 'number';
        elem.appendChild(document.createTextNode(value.toString()));
    } else if (typeof value === 'boolean') {
        // Boolean
        elem.className = 'boolean';
        elem.appendChild(document.createTextNode(value.toString()));
    }

    return elem;
}
