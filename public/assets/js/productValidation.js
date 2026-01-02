function productValidation() {
    const name = document.getElementById('name').value;
    const price = document.getElementById('Price').value;
    const quantity = document.getElementById('quantity').value;
    const category = document.getElementById('category').value;
    const description = document.getElementById('description').value;

    const priceRegex = /^(?:[1-9]\d*|0)(?:\.\d+)?$/;

    if (!name || name.trim() === '') {
        showError('nameError', 'Only use Alphabets');
        removeErrorsAfterDelay('nameError');
        return false;
    } else if (!priceRegex.test(price) || price.trim() === '') {
        showError('priceError', 'Only use numbers');
        removeErrorsAfterDelay('priceError');
        return false;
    } else if (!priceRegex.test(quantity) || quantity.trim() === '') {
        showError('quantityError', 'Only use numbers');
        removeErrorsAfterDelay('quantityError');
        return false;
    } else if (description.length <= 10 || description.trim() === '') {
        showError('descriptionError', 'Only use Alphabets and more than 10 letters');
        removeErrorsAfterDelay('descriptionError');
        return false;
    }

    // validate images: ensure total images (existing + newly selected) >= 4
    const total = countSelectedFiles();
    if (total < 4) {
        showError('imagesError', 'Please provide at least 4 images for the product.');
        removeErrorsAfterDelay('imagesError');
        return false;
    }

    return true;
}

function showError(id, message) {
    document.getElementById(id).innerText = message;
   
    return false;
}

function removeErrorsAfterDelay(errorId) {
    setTimeout(() => {
        const el = document.getElementById(errorId);
        if (el) el.innerText = '';
    }, 3000);
}

document.addEventListener('DOMContentLoaded', function () {
    initImageSelector();
});

let _hiddenInputCounter = 0;

function initImageSelector() {
    const wrapper = document.getElementById('imageSelectorWrapper');
    if (!wrapper) return;
    const selector = wrapper.querySelector('input[type=file]');
    if (!selector) return;
    selector.addEventListener('change', handleSelectorChange);
}

function handleSelectorChange(e) {
    const input = e.target;
    if (!input.files || input.files.length === 0) return;
    // create a hidden input with the same files (copy via DataTransfer) so files are submitted
    const holder = document.getElementById('fileInputsHolder');
    const hidden = document.createElement('input');
    const hiddenId = 'hidden-image-' + (++_hiddenInputCounter);
    hidden.type = 'file';
    hidden.name = 'image';
    hidden.multiple = true;
    hidden.id = hiddenId;
    hidden.style.display = 'none';
    let usedDataTransfer = false;
    try {
        const dt = new DataTransfer();
        for (let i = 0; i < input.files.length; i++) dt.items.add(input.files[i]);
        hidden.files = dt.files;
        holder.appendChild(hidden);
        usedDataTransfer = true;
    } catch (err) {
        // fallback: append the input itself if DataTransfer not available
        holder.appendChild(input);
    }

    // append previews for these files and tag them with hidden input id
    previewFiles(input.files, hiddenId);

    // clear visible selector so user can pick more files (one-by-one or multiple)
    input.value = '';
    clearImagesErrorIfOk();
}

function previewFiles(fileList, hiddenId) {
    const previewContainer = document.getElementById('previews');
    if (!previewContainer) return;
    const files = Array.from(fileList);
    files.forEach(file => {
        if (!file.type.startsWith('image/')) return;
        const reader = new FileReader();
        const wrapper = document.createElement('div');
        wrapper.style.position = 'relative';
        wrapper.style.width = '120px';
        wrapper.style.height = '120px';
        wrapper.style.flex = '0 0 auto';

        const img = document.createElement('img');
        img.style.width = '100%';
        img.style.height = '100%';
        img.style.objectFit = 'cover';
        img.style.border = '1px solid #ddd';

        const btn = document.createElement('button');
        btn.type = 'button';
        btn.innerText = '×';
        btn.title = 'Remove this image';
        btn.style.position = 'absolute';
        btn.style.top = '4px';
        btn.style.right = '4px';
        btn.style.background = 'rgba(0,0,0,0.6)';
        btn.style.color = '#fff';
        btn.style.border = 'none';
        btn.style.borderRadius = '50%';
        btn.style.width = '28px';
        btn.style.height = '28px';
        btn.style.cursor = 'pointer';

        // identifying attributes for removal: hidden input id and file signature
        const fileSig = `${file.name}::${file.size}::${file.lastModified}`;
        wrapper.dataset.hiddenId = hiddenId || '';
        wrapper.dataset.fileSig = fileSig;

        btn.addEventListener('click', function () {
            removeSelectedFile(wrapper.dataset.hiddenId, wrapper.dataset.fileSig, wrapper);
        });

        reader.onload = function (e) {
            img.src = e.target.result;
        }
        reader.readAsDataURL(file);

        wrapper.appendChild(img);
        wrapper.appendChild(btn);
        previewContainer.appendChild(wrapper);
    });
}

function removeSelectedFile(hiddenId, fileSig, wrapperEl) {
    // remove preview immediately
    if (wrapperEl && wrapperEl.parentNode) wrapperEl.parentNode.removeChild(wrapperEl);
    const holder = document.getElementById('fileInputsHolder');
    if (!holder) return;
    const hidden = document.getElementById(hiddenId);
    if (hidden && hidden.files) {
        try {
            const dt = new DataTransfer();
            for (let i = 0; i < hidden.files.length; i++) {
                const f = hidden.files[i];
                const sig = `${f.name}::${f.size}::${f.lastModified}`;
                if (sig !== fileSig) dt.items.add(f);
            }
            if (dt.files.length > 0) {
                hidden.files = dt.files;
            } else {
                // no files left in this hidden input; remove it
                hidden.parentNode.removeChild(hidden);
            }
        } catch (err) {
            // fallback: try to remove the whole hidden input element
            if (hidden.parentNode) hidden.parentNode.removeChild(hidden);
        }
    } else {
        // try to find a holder input that contains the file by signature
        const inputs = holder.querySelectorAll('input[type=file]');
        for (const i of inputs) {
            if (!i.files) continue;
            try {
                const dt = new DataTransfer();
                let removed = false;
                for (let k = 0; k < i.files.length; k++) {
                    const f = i.files[k];
                    const sig = `${f.name}::${f.size}::${f.lastModified}`;
                    if (sig !== fileSig) dt.items.add(f);
                    else removed = true;
                }
                if (removed) {
                    if (dt.files.length > 0) i.files = dt.files; else i.parentNode.removeChild(i);
                    break;
                }
            } catch (e) {
                // can't reconstruct; remove input
                if (i.parentNode) i.parentNode.removeChild(i);
            }
        }
    }
    clearImagesErrorIfOk();
}

function countSelectedFiles() {
    let total = 0;
    const existingCountEl = document.getElementById('existingCount');
    const existingCount = existingCountEl ? parseInt(existingCountEl.value, 10) || 0 : 0;
    total += existingCount;
    const holder = document.getElementById('fileInputsHolder');
    if (holder) {
        const inputs = holder.querySelectorAll('input[type=file]');
        inputs.forEach(i => {
            if (i.files) total += i.files.length;
        });
    }
    return total;
}

function clearImagesErrorIfOk() {
    const total = countSelectedFiles();
    if (total >= 4) {
        const el = document.getElementById('imagesError');
        if (el) el.innerText = '';
    }
}
