// script.js
const roomData = {
    "地下2층": ["주차장", "라운지"],
    "地下1층": ["주차장", "라운지"],
    "1층": ["식당"],
    "2층": ["식당"],
    "3층": ["과정운영실", "학습실K", "학습실L", "1호", "2호", "3호"],
    "4층": ["과정운영실", "1호", "2호", "3호", "4호", "5호"],
    "5층": ["과정운영실", "1호", "2호", "3호", "4호", "5호"],
    "6층": ["과정운영실", "1호", "2호", "3호", "4호", "5호"],
    "7층": ["과정운영실", "1호", "2호", "3호", "4호", "5호"],
    "8층": ["과정운영실", "1호", "2호", "3호", "4호", "5호"],
    "9층": ["과정운영실A", "과정운영실B", "1호", "2호", "3호", "4호", "5호", "6호", "7호", "8호", "9호", "10호", "11호", "12호", "13호", "14호", "15호", "16호", "17호", "18호", "19호", "20호"],
    "10층": ["과정운영실A", "과정운영실B", "1호", "2호", "3호", "4호", "5호", "6호", "7호", "8호", "9호", "10호", "11호", "12호", "13호", "14호", "15호", "16호", "17호", "18호", "19호", "20호"]
};

document.getElementById('floorSelect').addEventListener('change', function() {
    const floor = this.value;
    const roomList = document.getElementById('roomList');
    roomList.innerHTML = '';

    if (roomData[floor]) {
        roomData[floor].forEach(room => {
            const roomButton = document.createElement('div');
            roomButton.className = 'roomButton';
            roomButton.textContent = room;
            roomButton.dataset.state = 'off';

            roomButton.addEventListener('click', function() {
                if (this.dataset.state === 'off') {
                    this.classList.add('yellow');
                    this.dataset.state = 'on';
                } else {
                    this.classList.remove('yellow');
                    this.dataset.state = 'off';
                }
                updateRatios();
            });

            roomList.appendChild(roomButton);
        });
    } else {
        roomList.innerHTML = '이 층의 호실 정보가 없습니다.';
    }

    loadSavedState(); // 저장된 상태 불러오기
    updateRatios();
});

function updateRatios() {
    const floorSelect = document.getElementById('floorSelect');
    const floor = floorSelect.value;
    const roomButtons = document.querySelectorAll('#roomList .roomButton');

    const totalRooms = roomButtons.length;
    const yellowRooms = Array.from(roomButtons).filter(button => button.classList.contains('yellow')).length;
    const floorYellowRatio = totalRooms ? (yellowRooms / totalRooms * 100).toFixed(2) : 0;

    const totalYellowRooms = Array.from(document.querySelectorAll('#roomList .roomButton')).filter(button => button.classList.contains('yellow')).length;
    const totalRoomsAll = Object.values(roomData).flat().length;
    const totalYellowRatio = totalRoomsAll ? (totalYellowRooms / totalRoomsAll * 100).toFixed(2) : 0;

    document.getElementById('checkedRoomRatio').textContent = `${yellowRooms}/${totalRooms}`;
    document.getElementById('floorYellowRatio').textContent = `${floorYellowRatio}%`;
    document.getElementById('totalYellowRatio').textContent = `${totalYellowRatio}%`;
}

document.getElementById('saveButton').addEventListener('click', function() {
    const fileName = document.getElementById('fileName').value.trim();
    if (!fileName) {
        alert('파일명을 입력해 주세요.');
        return;
    }

    const floor = document.getElementById('floorSelect').value;
    const roomButtons = document.querySelectorAll('#roomList .roomButton');

    const roomState = {};
    roomButtons.forEach(button => {
        roomState[button.textContent] = button.classList.contains('yellow');
    });

    localStorage.setItem(`building-${floor}-${fileName}`, JSON.stringify(roomState));
    alert('저장 완료!');
    updateFileList(); // 저장 후 파일 목록 갱신
});

document.getElementById('loadButton').addEventListener('click', function() {
    const fileName = document.getElementById('fileName').value.trim();
    if (!fileName) {
        alert('파일명을 입력해 주세요.');
        return;
    }

    const floor = document.getElementById('floorSelect').value;
    const savedState = localStorage.getItem(`building-${floor}-${fileName}`);

    if (savedState) {
        const roomState = JSON.parse(savedState);
        document.querySelectorAll('#roomList .roomButton').forEach(button => {
            if (roomState[button.textContent]) {
                button.classList.add('yellow');
                button.dataset.state = 'on';
            } else {
                button.classList.remove('yellow');
                button.dataset.state = 'off';
            }
        });
        updateRatios();
    } else {
        alert('저장된 상태가 없습니다.');
    }
});

function updateFileList() {
    const floor = document.getElementById('floorSelect').value;
    const fileList = document.getElementById('fileList');
    fileList.innerHTML = '';

    Object.keys(localStorage).forEach(key => {
        if (key.startsWith(`building-${floor}-`)) {
            const fileName = key.replace(`building-${floor}-`, '');
            const fileItem = document.createElement('div');
            fileItem.className = 'fileItem';
            fileItem.innerHTML = `${fileName} <button onclick="deleteFile('${fileName}')">삭제</button>`;
            fileList.appendChild(fileItem);
        }
    });
}

function deleteFile(fileName) {
    const floor = document.getElementById('floorSelect').value;
    localStorage.removeItem(`building-${floor}-${fileName}`);
    alert('파일 삭제 완료!');
    updateFileList(); // 삭제 후 파일 목록 갱신
}

window.onload = updateFileList; // 페이지 로드 시 파일 목록 갱신