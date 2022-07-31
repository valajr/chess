function intiateGame(form) {
    try {
        startBoard(form.inpWidth.value, form.inpHeight.value);
    }
    catch {}
    hideMenu();

    return false;
}

function hideMenu() {
    document.getElementById("menuDiv").setAttribute('hidden', true);
    document.getElementById("boardDiv").removeAttribute('hidden');
}

function hideSkillTree() {
    document.getElementById("treeDiv").setAttribute('hidden', true);
}