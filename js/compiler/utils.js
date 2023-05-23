export const utils = {
    isValidColor(strColor) {
        var s = new Option().style;
        s.color = strColor;
    
        // return 'false' if color wasn't assigned
        return s.color == strColor.toLowerCase();
    },
    convertToRadians(deg) {
        const rad = (Math.PI * deg) / 180;
        return rad;
    },

    hexToRGB(hex) {
        var r = parseInt(hex.slice(1, 3), 16),
            g = parseInt(hex.slice(3, 5), 16),
            b = parseInt(hex.slice(5, 7), 16);
        return [r, g, b, 255];
    }
}