function getPixel(imageData, x, y) {
    if (x < 0 || y < 0 || x >= imageData.width || y >= imageData.height) {
      return [-1, -1, -1, -1];
    } else {
      const offset = (y * imageData.width + x) * 4;
      return imageData.data.slice(offset, offset + 4);
    }
}

function setPixel(imageData, x, y, color) {
    const offset = (y * imageData.width + x) * 4;
    imageData.data[offset + 0] = color[0];
    imageData.data[offset + 1] = color[1];
    imageData.data[offset + 2] = color[2];
    imageData.data[offset + 3] = color[3];
}

function colorsMatch(a, b) {
    return a[0] === b[0] && a[1] === b[1] && a[2] === b[2] && a[3] === b[3];
}

function floodFill(imageData, x, y, fillColor) {
    const visited = new Uint8Array(imageData.width, imageData.height);
    const targetColor = getPixel(imageData, x, y);
    try {
        if (!colorsMatch(targetColor, fillColor)) {
            const pixelsToCheck = [{x, y}];
            while (pixelsToCheck.length > 0) {
                const {x, y} = pixelsToCheck.pop();
                
                const currentColor = getPixel(imageData, x, y);
                if (
                    !visited[y * imageData.width + x] &&
                    colorsMatch(currentColor, targetColor)
                ) {
                    setPixel(imageData, x, y, fillColor);
                    visited[y * imageData.width + x] = 1;
                    pixelsToCheck.push({x: x + 1, y});
                    pixelsToCheck.push({x: x - 1, y});
                    pixelsToCheck.push({x, y:  y + 1});
                    pixelsToCheck.push({x, y: y - 1});
                }
            }
        }
    } catch(e) {
        console.error(e);
    }
}
  
self.onmessage = (e) => {
    const {x, y, fillColor, imageData} = e.data;
    floodFill(imageData, x, y, fillColor);  
    self.postMessage(imageData);
};