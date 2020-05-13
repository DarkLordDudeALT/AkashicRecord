const canvas = document.getElementById("canvi");
const ctx = canvas.getContext("2d");
const optionButtons = [document.getElementById("cllpse_open"), document.getElementById("cllpse_close")];
const optionsMenu = document.getElementById("optins");

let width = canvas.width;
let height = canvas.height;
let halfWidth = width / 2;
let halfHeight = height / 2;

let sunSize = 1390000;
let timeContractionFactor = 50; 

const fontSize = 30;
const maxDisplayedNotifications = 4;
const backgroundColor = "#000000";
const orbitBandColor = "#7f7f7f";
const notificationBorderColor = "#233273";
const notificationColor = "#18121e"; 
const notificationTextColor = "#eac67a";

/* 
 * Add astroid belt.
 *
 * Make it so stellar bodies speed up when getting closer to their perhilion and slow down when getting close to their aphelion.
 *
 * Use actual images instead of monocolor circles.
 * Make it so if rot_km_h is NaN the stellar object is tidal locked (syncronous orbit).
 *
 * Possibly add manmade satellites
 *
 * Do a preformance audit, optimize everything.
 */

// A massive array containing the various stellar bodies of our solar system.
let solarSystem = [
                  {name: "Sol", diameter_km: 1390000, rot_km_h: 7189, rev_km_s: null, color: "#33ff00", aphelion_km: null, perihelion_km: null, eccentricity: null, parent: null, mean_anomaly_deg: null, longitude_of_ascending_node_deg: null, type: 'star'}, 
                     {name: "Mercury", diameter_km: 4880, rot_km_h: 10.892, rev_km_s: 47.362, color: "grey", aphelion_km: 69816900, perihelion_km: 46001200, eccentricity: 0.205630, parent: "Sol", mean_anomaly_deg: 174.796, longitude_of_ascending_node_deg: 48.331, type: 'planet'},
   
                     {name: "Venus", diameter_km: 12105.6, rot_km_h: 6.52, rev_km_s: 35.02, color: "#ffffff", aphelion_km: 108939000, perihelion_km: 107477000, eccentricity: 0.006772, parent: "Sol", mean_anomaly_deg: 50.155, longitude_of_ascending_node_deg: 76.680, type: 'planet'}, 
   
                     {name: "Gaia", diameter_km: 12742, rot_km_h: 0.4651, rev_km_s: 29.78, color: "#0000ff", aphelion_km: 152100000, perihelion_km: 147095000, eccentricity: 0.0167086, parent: "Sol", mean_anomaly_deg: 358.617, longitude_of_ascending_node_deg: -11.26064, type: 'planet'},
                        {name: "Luna", diameter_km: 3474.2, rot_km_h: 4.627, rev_km_s: 1.022, color: "grey", aphelion_km: 405400, perihelion_km: 362600, eccentricity: 0.0549, parent: "Gaia", mean_anomaly_deg: null, longitude_of_ascending_node_deg: -0.00000128989, type: 'moon'},
   
                     {name: "Mars", diameter_km: 6783, rot_km_h: 241.17, rev_km_s: 24.007, color: "#ff0000", aphelion_km: 249200000, perihelion_km: 206700000, eccentricity: 0.0934, parent: "Sol", mean_anomaly_deg: null, longitude_of_ascending_node_deg: 49.558, type: 'planet'},
                        {name: "Phobos", diameter_km: 22.5334, rot_km_h: 11, rev_km_s: 2.138, color: "grey", aphelion_km: 9517.58, perihelion_km: 9234.42, eccentricity: 0.0151, parent: "Mars", mean_anomaly_deg: null, longitude_of_ascending_node_deg: null, type: 'moon'},
                        {name: "Deimos", diameter_km: 12.76, rot_km_h: NaN, rev_km_s: 1.3513, color: "grey", aphelion_km: 23470.9, perihelion_km: 23455.5, eccentricity: 0.00033, parent: "Mars", mean_anomaly_deg: null, longitude_of_ascending_node_deg: null, type: 'moon'}, 
   
                     {name: "Jupiter", diameter_km: 139822, rot_km_h: 12.6, rev_km_s: 13.07, color: "lightgreen", aphelion_km: 816620000, perihelion_km: 740520000, eccentricity: 0.0489, parent: "Sol", mean_anomaly_deg: null, longitude_of_ascending_node_deg: 100.464, type: 'planet'},
                        {name: "Io", diameter_km: 3644.2, rot_km_h: 271, rev_km_s: 17.334, color: "green", aphelion_km: 423400, perihelion_km: 420000, eccentricity: 0.0041, parent: "Jupiter", mean_anomaly_deg: 20.02, longitude_of_ascending_node_deg: null, type: 'moon'},
                        {name: "Europa", diameter_km: 1561.3, rot_km_h: NaN, rev_km_s: 13.74, color: "lightblue", aphelion_km: 676938, perihelion_km: 664862, eccentricity: 0.009, parent: "Jupiter", mean_anomaly_deg: null, longitude_of_ascending_node_deg: null, type: 'moon'},
                        {name: "Ganymede", diameter_km: 5268.8, rot_km_h: NaN, rev_km_s: 10.880, color: "lightgrey", aphelion_km: 1071600, perihelion_km: 1069200, eccentricity: 0.0013, parent: "Jupiter", mean_anomaly_deg: null, longitude_of_ascending_node_deg: null, type: 'moon'},
                        {name: "Callisto", diameter_km: 4823.6, rot_km_h: NaN, rev_km_s: 8.204, color: "lightblue", aphelion_km: 1897000, perihelion_km: 1869000, eccentricity: 0.0074, parent: "Jupiter", mean_anomaly_deg: null, longitude_of_ascending_node_deg: null, type: 'moon'},
                        {name: "Metis", diameter_km: 47, rot_km_h: NaN, rev_km_s: 31.501, color: "lightgrey", aphelion_km: 128026, perihelion_km: 127974, eccentricity: 0.0002, parent: "Jupiter", mean_anomaly_deg: null, longitude_of_ascending_node_deg: null, type: 'moon'},
                        {name: "Adrastea", diameter_km: 20.4, rot_km_h: NaN, rev_km_s: 31.378, color: "lightgrey", aphelion_km: 129000, perihelion_km: 129000, eccentricity: 0.0015, parent: "Jupiter", mean_anomaly_deg: null, longitude_of_ascending_node_deg: null, type: 'moon'},
                        {name: "Amalthea", diameter_km: 171, rot_km_h: NaN, rev_km_s: 26.57, color: "lightgreen", aphelion_km: 182840, perihelion_km: 181150, eccentricity: 0.00323, parent: "Jupiter", mean_anomaly_deg: null, longitude_of_ascending_node_deg: null, type: 'moon'},
                        {name: "Thebe", diameter_km: 102.6, rot_km_h: NaN, rev_km_s: 23.92, color: "lightgrey", aphelion_km: 226000, perihelion_km: 218000, eccentricity: 0.0179, parent: "Jupiter", mean_anomaly_deg: null, longitude_of_ascending_node_deg: null, type: 'moon'},
                        {name: "Themisto", diameter_km: 8, rot_km_h: null, rev_km_s: 4.098, color: "white", aphelion_km: 8874300, perihelion_km: 7391650, eccentricity: 0.2006, parent: "Jupiter", mean_anomaly_deg: null, longitude_of_ascending_node_deg: null, type: 'moon'},
                        {name: "Leda", diameter_km: 20, rot_km_h: null, rev_km_s: 3.4, color: "white", aphelion_km: 11160000, perihelion_km: 11160000, eccentricity: 0.16, parent: "Jupiter", mean_anomaly_deg: null, longitude_of_ascending_node_deg: null, type: 'moon'},
                        {name: "Himalia", diameter_km: 170, rot_km_h: 173.172441047, rev_km_s: 3.312, color: "white", aphelion_km: 13082000, perihelion_km: 9782900, eccentricity: 0.16, parent: "Jupiter", mean_anomaly_deg: null, longitude_of_ascending_node_deg: null, type: 'moon'},
                        {name: "Ersa", diameter_km: 6, rot_km_h: null, rev_km_s: 3.3137592263, color: "lightgrey", aphelion_km: 11483000, perihelion_km: 11483000, eccentricity: 0.094, parent: "Jupiter", mean_anomaly_deg: null, longitude_of_ascending_node_deg: null, type: 'moon'},
                        {name: "Pandia", diameter_km: 2, rot_km_h: null, rev_km_s: 3.19988040123, color: "lightgrey", aphelion_km: 11525000, perihelion_km: 11525000, eccentricity: 0.18, parent: "Jupiter", mean_anomaly_deg: null, longitude_of_ascending_node_deg: null, type: 'moon'},
                        {name: "Lysithea", diameter_km: 36, rot_km_h: null, rev_km_s: 3.29, color: "darkgrey", aphelion_km: 11720000, perihelion_km: 11720000, eccentricity: 0.11, parent: "Jupiter", mean_anomaly_deg: null, longitude_of_ascending_node_deg: null, type: 'moon'},
                        {name: "Elara", diameter_km: 86, rot_km_h: 22.5147473507, rev_km_s: 3.27, color: "white", aphelion_km: 11740000, perihelion_km: 11740000, eccentricity: 0.22, parent: "Jupiter", mean_anomaly_deg: null, longitude_of_ascending_node_deg: null, type: 'moon'},
                        {name: "Dia", diameter_km: 4, rot_km_h: null, rev_km_s: 3.2114482891, color: "lightgrey", aphelion_km: 12100000, perihelion_km: 12100000, eccentricity: 0.21, parent: "Jupiter", mean_anomaly_deg: null, longitude_of_ascending_node_deg: null, type: 'moon'},
                        {name: "Capro", diameter_km: 3, rot_km_h: null, rev_km_s: 2.7186036182, color: "lightgrey", aphelion_km: 17145000, perihelion_km: 17145000, eccentricity: 0.4316, parent: "Jupiter", mean_anomaly_deg: null, longitude_of_ascending_node_deg: null, type: 'moon'},
                        {name: "S/2003 J 12", diameter_km: 1, rot_km_h: null, rev_km_s: -2.65557555111, color: "lightgrey", aphelion_km: 17883000, perihelion_km: 17883000, eccentricity: 0.492, parent: "Jupiter", mean_anomaly_deg: null, longitude_of_ascending_node_deg: null, type: 'moon'}, 
                        {name: "Valetudo", diameter_km: 1, rot_km_h: null, rev_km_s: 2.58815779133, color: "white", aphelion_km: 18980000, perihelion_km: 18980000, eccentricity: 0.222, parent: "Jupiter", mean_anomaly_deg: null, longitude_of_ascending_node_deg: null, type: 'moon'}, 
                        {name: "Euporie", diameter_km: 2, rot_km_h: null, rev_km_s: -2.56453281703, color: "lightgrey", aphelion_km: 19000000, perihelion_km: 19000000, eccentricity: 0, parent: "Jupiter", mean_anomaly_deg: null, longitude_of_ascending_node_deg: null, type: 'moon'}, 
                        {name: "Eupheme", diameter_km: 2, rot_km_h: null, rev_km_s: -2.54124018751, color: "lightgrey", aphelion_km: 19622000, perihelion_km: 19622000, eccentricity: 0, parent: "Jupiter", mean_anomaly_deg: null, longitude_of_ascending_node_deg: null, type: 'moon'}, 
                        {name: "Jupiter LV", diameter_km: 2, rot_km_h: null, rev_km_s: -2.50338774695, color: "lightgrey", aphelion_km: 20220000, perihelion_km: 20220000, eccentricity: 0, parent: "Jupiter", mean_anomaly_deg: null, longitude_of_ascending_node_deg: null, type: 'moon'}, 
                        {name: "Jupiter LII", diameter_km: 1, rot_km_h: null, rev_km_s: 2.50802897601, color: "lightgrey", aphelion_km: 20307150, perihelion_km: 20307150, eccentricity: 0.307, parent: "Jupiter", mean_anomaly_deg: null, longitude_of_ascending_node_deg: null, type: 'moon'}, 
                        {name: "Thelxione", diameter_km: 2, rot_km_h: null, rev_km_s: -2.48902180699, color: "lightgrey", aphelion_km: 20454000, perihelion_km: 20454000, eccentricity: 0, parent: "Jupiter", mean_anomaly_deg: null, longitude_of_ascending_node_deg: null, type: 'moon'},
                        {name: "Euanthe", diameter_km: 3, rot_km_h: null, rev_km_s: -2.48833675964, color: "lightgrey", aphelion_km: 20465000, perihelion_km: 20465000, eccentricity: 0, parent: "Jupiter", mean_anomaly_deg: null, longitude_of_ascending_node_deg: null, type: 'moon'},
                        {name: "Helike", diameter_km: 4, rot_km_h: null, rev_km_s: -0.394525655915, color: "lightgrey", aphelion_km: 20500000, perihelion_km: 20500000, eccentricity: 0, parent: "Jupiter", mean_anomaly_deg: null, longitude_of_ascending_node_deg: null, type: 'moon'},
                        {name: "Orthosie", diameter_km: 2, rot_km_h: null, rev_km_s: -2.45199000337, color: "lightgrey", aphelion_km: 21075662, perihelion_km: 21075662, eccentricity: 0.337, parent: "Jupiter", mean_anomaly_deg: null, longitude_of_ascending_node_deg: null, type: 'moon'},
                        {name: "Jupiter LXVIII", diameter_km: 2, rot_km_h: null, rev_km_s: 2.48927608702, color: "lightgrey", aphelion_km: 20627000, perihelion_km: 20627000, eccentricity: 0.215, parent: "Jupiter", mean_anomaly_deg: null, longitude_of_ascending_node_deg: null, type: 'moon'},
                        {name: "Jupiter LXIV", diameter_km: 2, rot_km_h: null, rev_km_s: 2.48433397308, color: "lightgrey", aphelion_km: 20694000, perihelion_km: 20694000, eccentricity: 0.148, parent: "Jupiter", mean_anomaly_deg: null, longitude_of_ascending_node_deg: null, type: 'moon'},
                        {name: "Iocaste", diameter_km: 5.2, rot_km_h: null, rev_km_s: -2.42066666667, color: "lightgrey", aphelion_km: 25847607, perihelion_km: 16696393, eccentricity: 0.2874, parent: "Jupiter", mean_anomaly_deg: null, longitude_of_ascending_node_deg: null, type: 'moon'},
                        {name: "S/2003 J 16", diameter_km: 2, rot_km_h: null, rev_km_s: -2.47155991058, color: "lightgrey", aphelion_km: 20744000, perihelion_km: 20744000, eccentricity: 0, parent: "Jupiter", mean_anomaly_deg: null, longitude_of_ascending_node_deg: null, type: 'moon'},
                        {name: "Harpalyke", diameter_km: 4, rot_km_h: null, rev_km_s: -2.45270503318, color: "lightgrey", aphelion_km: 21064000, perihelion_km: 21064000, eccentricity: 0.2441, parent: "Jupiter", mean_anomaly_deg: null, longitude_of_ascending_node_deg: null, type: 'moon'},
                        {name: "Mneme", diameter_km: 2, rot_km_h: null, rev_km_s: -2.43, color: "lightgrey", aphelion_km: 21427000, perihelion_km: 21427000, eccentricity: 0.2214, parent: "Jupiter", mean_anomaly_deg: null, longitude_of_ascending_node_deg: null, type: 'moon'},
                        {name: "Hermippe", diameter_km: 4, rot_km_h: null, rev_km_s: -2.42406840555, color: "white", aphelion_km: 21000000, perihelion_km: 21000000, eccentricity: 0.229, parent: "Jupiter", mean_anomaly_deg: null, longitude_of_ascending_node_deg: null, type: 'moon'},
                        {name: "Thyone", diameter_km: 4, rot_km_h: null, rev_km_s: -2.43, color: "lightgrey", aphelion_km: 21406000, perihelion_km: 21406000, eccentricity: 0.2526, parent: "Jupiter", mean_anomaly_deg: null, longitude_of_ascending_node_deg: null, type: 'moon'},
                        {name: "Jupiter LXX", diameter_km: 3, rot_km_h: null, rev_km_s: -2.44458500454, color: "lightgrey", aphelion_km: 21487000, perihelion_km: 21487000, eccentricity: 0.229, parent: "Jupiter", mean_anomaly_deg: null, longitude_of_ascending_node_deg: null, type: 'moon'},
                        {name: "Ananke", diameter_km: 28, rot_km_h: null, rev_km_s: -2.367, color: "white", aphelion_km: 29063500, perihelion_km: 12567000, eccentricity: 0.24, parent: "Jupiter", mean_anomaly_deg: null, longitude_of_ascending_node_deg: null, type: 'moon'},
                        {name: "Herse", diameter_km: 2, rot_km_h: null, rev_km_s: -2.39260515413, color: "lightgrey", aphelion_km: 22134000, perihelion_km: 22134000, eccentricity: 0.2493, parent: "Jupiter", mean_anomaly_deg: null, longitude_of_ascending_node_deg: null, type: 'moon'},
                        {name: "Aitne", diameter_km: 3, rot_km_h: null, rev_km_s: -2.38451025251, color: "lightgrey", aphelion_km: 22285000, perihelion_km: 22285000, eccentricity: 0.393, parent: "Jupiter", mean_anomaly_deg: null, longitude_of_ascending_node_deg: null, type: 'moon'}, 
                        {name: "Jupiter LXVII", diameter_km: 2, rot_km_h: null, rev_km_s: -2.38508702334, color: "lightgrey", aphelion_km: 22455000, perihelion_km: 22455000, eccentricity: 0.5569, parent: "Jupiter", mean_anomaly_deg: null, longitude_of_ascending_node_deg: null, type: 'moon'}, 
                        {name: "Jupiter LXXII", diameter_km: 1, rot_km_h: null, rev_km_s: -2.37832652705, color: "lightgrey", aphelion_km: 22401817, perihelion_km: 22401817, eccentricity: 0.2328, parent: "Jupiter", mean_anomaly_deg: null, longitude_of_ascending_node_deg: null, type: 'moon'}, 
                        {name: "Kale", diameter_km: 2, rot_km_h: null, rev_km_s: -2.3778949329, color: "lightgrey", aphelion_km: 22409000, perihelion_km: 22409000, eccentricity: 0.2011, parent: "Jupiter", mean_anomaly_deg: null, longitude_of_ascending_node_deg: null, type: 'moon'}, 
                        {name: "Taygete", diameter_km: 5, rot_km_h: null, rev_km_s: -2.3763936776, color: "lightgrey", aphelion_km: 22439000, perihelion_km: 22439000, eccentricity: 0.3678, parent: "Jupiter", mean_anomaly_deg: null, longitude_of_ascending_node_deg: null, type: 'moon'},
                        {name: "Jupiter LXI", diameter_km: 2, rot_km_h: null, rev_km_s: -2.36215996088, color: "lightgrey", aphelion_km: 22709000, perihelion_km: 22709000, eccentricity: 0.1961, parent: "Jupiter", mean_anomaly_deg: null, longitude_of_ascending_node_deg: null, type: 'moon'},
                        {name: "Chaldene", diameter_km: 3.8, rot_km_h: null, rev_km_s: -2.36189360751, color: "lightgrey", aphelion_km: 22713000, perihelion_km: 22713000, eccentricity: 0.2916, parent: "Jupiter", mean_anomaly_deg: null, longitude_of_ascending_node_deg: null, type: 'moon'},
                        {name: "Philophrosyne", diameter_km: 2, rot_km_h: null, rev_km_s: -2.36154698357, color: "lightgrey", aphelion_km: 22721000, perihelion_km: 22721000, eccentricity: 0.0932, parent: "Jupiter", mean_anomaly_deg: null, longitude_of_ascending_node_deg: null, type: 'moon'},
                        {name: "S/2003 J 10", diameter_km: 2, rot_km_h: null, rev_km_s: -2.36105770193, color: "lightgrey", aphelion_km: 22731000, perihelion_km: 22731000, eccentricity: 0.3438, parent: "Jupiter", mean_anomaly_deg: null, longitude_of_ascending_node_deg: null, type: 'moon'},
                        {name: "S/2003 J 23", diameter_km: 2, rot_km_h: null, rev_km_s: -2.36061350885, color: "lightgrey", aphelion_km: 22740000, perihelion_km: 22740000, eccentricity: 0.3931, parent: "Jupiter", mean_anomaly_deg: null, longitude_of_ascending_node_deg: null, type: 'moon'},
                        {name: "Erinome", diameter_km: 3.2, rot_km_h: null, rev_km_s: -2.34785290161, color: "lightgrey", aphelion_km: 22986000, perihelion_km: 22986000, eccentricity: 0.2552, parent: "Jupiter", mean_anomaly_deg: null, longitude_of_ascending_node_deg: null, type: 'moon'},
                        {name: "Aoede", diameter_km: 4, rot_km_h: null, rev_km_s: -2.3449108735, color: "lightgrey", aphelion_km: 23044000, perihelion_km: 23044000, eccentricity: 0.4311, parent: "Jupiter", mean_anomaly_deg: null, longitude_of_ascending_node_deg: null, type: 'moon'},
                        {name: "Kallichore", diameter_km: 2, rot_km_h: null, rev_km_s: -2.34151298494, color: "lightgrey", aphelion_km: 23112000, perihelion_km: 23112000, eccentricity: 0.2042, parent: "Jupiter", mean_anomaly_deg: null, longitude_of_ascending_node_deg: null, type: 'moon'},
                        {name: "Jupiter LXVI", diameter_km: 2, rot_km_h: null, rev_km_s: -2.34490238023, color: "lightgrey", aphelion_km: 23232000, perihelion_km: 23232000, eccentricity: 0.2842, parent: "Jupiter", mean_anomaly_deg: null, longitude_of_ascending_node_deg: null, type: 'moon'},
                        {name: "Jupiter LXIX", diameter_km: 1, rot_km_h: null, rev_km_s: -2.34419216817, color: "lightgrey", aphelion_km: 23232700, perihelion_km: 23232700, eccentricity: 0.3118, parent: "Jupiter", mean_anomaly_deg: null, longitude_of_ascending_node_deg: null, type: 'moon'},
                        {name: "Kalyke", diameter_km: 5.2, rot_km_h: null, rev_km_s: -2.33803161249, color: "lightgrey", aphelion_km: 23181000, perihelion_km: 23181000, eccentricity: 0.214, parent: "Jupiter", mean_anomaly_deg: null, longitude_of_ascending_node_deg: null, type: 'moon'},
                        {name: "Carme", diameter_km: 46, rot_km_h: null, rev_km_s: -2.253, color: "white", aphelion_km: 23400000, perihelion_km: 23400000, eccentricity: 0.25, parent: "Jupiter", mean_anomaly_deg: null, longitude_of_ascending_node_deg: null, type: 'moon'},
                        {name: "Callirrhoe", diameter_km: 17.2, rot_km_h: null, rev_km_s: -2.30954473414, color: "white", aphelion_km: 24099000, perihelion_km: 24099000, eccentricity: 0.2796, parent: "Jupiter", mean_anomaly_deg: 107.962, longitude_of_ascending_node_deg: 283.104, type: 'moon'}, 
                        {name: "Eurydome", diameter_km: 3, rot_km_h: null, rev_km_s: -2.3355014507, color: "lightgrey", aphelion_km: 23231000, perihelion_km: 23231000, eccentricity: 0.377, parent: "Jupiter", mean_anomaly_deg: null, longitude_of_ascending_node_deg: null, type: 'moon'},
                        {name: "Jupiter LXIII", diameter_km: 2, rot_km_h: null, rev_km_s: -2.3412154534, color: "lightgrey", aphelion_km: 23303000, perihelion_km: 23303000, eccentricity: 0.236, parent: "Jupiter", mean_anomaly_deg: null, longitude_of_ascending_node_deg: null, type: 'moon'},
                        {name: "Pasithee", diameter_km: 2, rot_km_h: null, rev_km_s: -2.32841878283, color: "lightgrey", aphelion_km: 23307000, perihelion_km: 23307000, eccentricity: 0.3289, parent: "Jupiter", mean_anomaly_deg: null, longitude_of_ascending_node_deg: null, type: 'moon'},
                        {name: "Jupiter LI", diameter_km: 2, rot_km_h: null, rev_km_s: -2.34070503644, color: "lightgrey", aphelion_km: 23314335, perihelion_km: 23314335, eccentricity: 0.32, parent: "Jupiter", mean_anomaly_deg: null, longitude_of_ascending_node_deg: null, type: 'moon'},
                        {name: "Kore", diameter_km: 2, rot_km_h: null, rev_km_s: -2.33514034474, color: "lightgrey", aphelion_km: 23239000, perihelion_km: 23239000, eccentricity: 0.2462, parent: "Jupiter", mean_anomaly_deg: null, longitude_of_ascending_node_deg: null, type: 'moon'},
                        {name: "Cyllene", diameter_km: 2, rot_km_h: null, rev_km_s: -2.32718842795, color: "lightgrey", aphelion_km: 23396000, perihelion_km: 23396000, eccentricity: 0.4116, parent: "Jupiter", mean_anomaly_deg: null, longitude_of_ascending_node_deg: null, type: 'moon'},
                        {name: "Jupter LVI", diameter_km: 4, rot_km_h: null, rev_km_s: -2.32698047507, color: "lightgrey", aphelion_km: 23400981, perihelion_km: 23400981, eccentricity: 0.3321, parent: "Jupiter", mean_anomaly_deg: null, longitude_of_ascending_node_deg: null, type: 'moon'},
                        {name: "Eukelade", diameter_km: 4, rot_km_h: null, rev_km_s: -2.32291168808, color: "lightgrey", aphelion_km: 23484000, perihelion_km: 23484000, eccentricity: 0.2829, parent: "Jupiter", mean_anomaly_deg: null, longitude_of_ascending_node_deg: null, type: 'moon'},
                        {name: "Jupiter LIX", diameter_km: 4, rot_km_h: null, rev_km_s: -2.33232606671, color: "lightgrey", aphelion_km: 23547105, perihelion_km: 23547105, eccentricity: 0.397, parent: "Jupiter", mean_anomaly_deg: null, longitude_of_ascending_node_deg: null, type: 'moon'},
                        {name: "S/2003 J 4", diameter_km: 2, rot_km_h: null, rev_km_s: -2.31859030191, color: "lightgrey", aphelion_km: 23571000, perihelion_km: 23571000, eccentricity: 0.3003, parent: "Jupiter", mean_anomaly_deg: null, longitude_of_ascending_node_deg: null, type: 'moon'},
                        {name: "Pasiphae", diameter_km: 38, rot_km_h: null, rev_km_s: -2.242, color: "lightgrey", aphelion_km: 31209300, perihelion_km: 16980250, eccentricity: 0.2953, parent: "Jupiter", mean_anomaly_deg: null, longitude_of_ascending_node_deg: null, type: 'moon'},
                        {name: "Hegemone", diameter_km: 3, rot_km_h: null, rev_km_s: -2.3121808216, color: "lightgrey", aphelion_km: 23703000, perihelion_km: 23703000, eccentricity: 0.2953, parent: "Jupiter", mean_anomaly_deg: null, longitude_of_ascending_node_deg: null, type: 'moon'},
                        {name: "Arche", diameter_km: 3, rot_km_h: null, rev_km_s: -2.31142265153, color: "white", aphelion_km: 23717000, perihelion_km: 23717000, eccentricity: 0.149, parent: "Jupiter", mean_anomaly_deg: null, longitude_of_ascending_node_deg: null, type: 'moon'},
                        {name: "Isonoe", diameter_km: 3.8, rot_km_h: null, rev_km_s: -2.30584924743, color: "lightgrey", aphelion_km: 23833000, perihelion_km: 23833000, eccentricity: 0.166, parent: "Jupiter", mean_anomaly_deg: null, longitude_of_ascending_node_deg: null, type: 'moon'},
                        {name: "S/2003 J 9", diameter_km: 1, rot_km_h: null, rev_km_s: -2.3046132315, color: "lightgrey", aphelion_km: 23858000, perihelion_km: 23858000, eccentricity: 0.276, parent: "Jupiter", mean_anomaly_deg: null, longitude_of_ascending_node_deg: null, type: 'moon'},
                        {name: "Eirene", diameter_km: 4, rot_km_h: null, rev_km_s: -2.29901650925, color: "lightgrey", aphelion_km: 23974000, perihelion_km: 23974000, eccentricity: 0.307, parent: "Jupiter", mean_anomaly_deg: null, longitude_of_ascending_node_deg: null, type: 'moon'},
                        {name: "Sinope", diameter_km: 38, rot_km_h: null, rev_km_s: -2.252, color: "white", aphelion_km: 30191200, perihelion_km: 18237600, eccentricity: 0.25, parent: "Jupiter", mean_anomaly_deg: null, longitude_of_ascending_node_deg: null, type: 'moon'},
                        {name: "Sponde", diameter_km: 2, rot_km_h: null, rev_km_s: -2.28579417835, color: "lightgrey", aphelion_km: 24253000, perihelion_km: 24253000, eccentricity: 0.443, parent: "Jupiter", mean_anomaly_deg: null, longitude_of_ascending_node_deg: null, type: 'moon'},
                        {name: "Autonoe", diameter_km: 4, rot_km_h: null, rev_km_s: -2.28516057874, color: "lightgrey", aphelion_km: 24264000, perihelion_km: 24264000, eccentricity: 0.369, parent: "Jupiter", mean_anomaly_deg: null, longitude_of_ascending_node_deg: null, type: 'moon'},
                        {name: "Megaclite", diameter_km: 5.4, rot_km_h: null, rev_km_s: -2.26552937563, color: "lightgrey", aphelion_km: 24687000, perihelion_km: 24687000, eccentricity: 0.308, parent: "Jupiter", mean_anomaly_deg: null, longitude_of_ascending_node_deg: null, type: 'moon'},
                        {name: "S/2003 J 2", diameter_km: 2, rot_km_h: null, rev_km_s: -2.19, color: "lightgrey", aphelion_km: 29545579.5, perihelion_km: 29545579.5, eccentricity: 0.4074, parent: "Jupiter", mean_anomaly_deg: null, longitude_of_ascending_node_deg: null, type: 'moon'},
   
                     {name: "Saturn", diameter_km: 116464, rot_km_h: 0.00274166666667, rev_km_s: 9.68, color: "lightgreen", aphelion_km: 1514500000, perihelion_km: 1352550000, eccentricity: 0.0565, parent: "Sol", mean_anomaly_deg: 317.02, longitude_of_ascending_node_deg: 113.665, type: 'planet'}
   ];

// {name: "Name", diameter_km: 1, rot_km_h: null, rev_km_s: 0, color: "lightgrey", aphelion_km: 1, perihelion_km: 1, eccentricity: 0, parent: null, mean_anomaly_deg: null, longitude_of_ascending_node_deg: null, type: 'type'},

let camera = {x: 0, y: 0, zoom: 0.0000005, speed: 512, zoomSpeed: 0.25, following: null};
let moveUp = false;
let moveDown = false;
let moveLeft = false;
let moveRight = false;
let zoomIn = false;
let zoomOut = false;
let speedUp = false;
let speedDown = false;
let time = 0;
let speedUpTime = false;
let slowDownTime = false;
let mouse = [0, 0];

////////////////////////////////
// CompiledSolarObjects Begin //
////////////////////////////////

/**
 * Gets the normalized size of a stellar body relative to the sun.
 *
 * @param {number} diameter_km The diameter of the stellar body, in kilometers.
 *
 * @returns The normalized (relative) size of the stellar body, in kilometers.
 */
function getRelativeSize(diameter_km) {
   return diameter_km / 1390000 * sunSize; // Sun's diameter = 1390000 km
}

/**
 * @class
 *
 * Creates a compiled form of a stellar body, allowing the program to run faster.
 *
 * @param {string} name The name of the stellar body. Can be null.
 * @param {number} diameter_km The diameter of the stellar body, in kilometers.
 * @param {number} rot_km_h The speed at which the stellar body rotates, in kilometers per hour. Can be null.
 * @param {number} rev_km_s The speed at which the stellar body revolves around its parent, in kilometers per second.
 * @param {string} color The color of the stellar body. Can be null.
 * @param {number} aphelion_km The distance at which the stellar body is farthest from its parent, in kilometers.
 * @param {number} perihelion_km The distance at which the stellar body is closest to its parent, in kilometers.
 * @param {number} eccentricity The eccentricity of the orbit. Eccentricity describes how "squished" an ellipse is.
 * @param {string} parent The name of the object that the stellar object orbits. Can be null.
 * @param {number} mean_anomaly_deg Acts like a jumpstart on the orbit of a stellar object. The unit is degrees. Can be null.
 * @param {number} longitude_of_ascending_node_deg How much to rotate the orbit by, in degrees. Can be null.
 * @param {string} type The type of the stellar body. Can be null.
 *
 * @returns A compiled form of a stellar body.
 */
function CompiledSolarObject(name, diameter_km, rot_km_h, rev_km_s, color, aphelion_km, perihelion_km, eccentricity, parent, mean_anomaly_deg, longitude_of_ascending_node_deg, type) {
   this.name = name;
   this.x = 0;
   this.y = 0;
   this.relativeSize = getRelativeSize(diameter_km);
   this.rot_km_h = rot_km_h;
   this.rev_km_s = rev_km_s;
   this.color = color;
   this.semiMajorAxis_km = (aphelion_km + perihelion_km) / 2;
   this.semiMinorAxis_km = (aphelion_km + perihelion_km) / 2 * Math.sqrt(1 - Math.pow(eccentricity, 2));
   this.aphelion_km = aphelion_km;
   this.perihelion_km = perihelion_km;
   this.eccentricity = eccentricity;
   this.parent = parent;
   this.mean_anomaly_rad = mean_anomaly_deg * (Math.PI / 180);
   this.longitude_of_ascending_node_rad = longitude_of_ascending_node_deg * (Math.PI / 180);
   this.type = type;
}

// Compiles the solar system so that it costs less computer resources to run.
let compiledSolarSystem = [];
for (let i = 0; i < solarSystem.length; i++) {
   let parentName = solarSystem[i].parent;
   let actualParent = 0;
   
   if (parentName == null) 
      actualParent = null;
   
   else
      for (let k = 0; k < solarSystem.length; k++) 
         if (solarSystem[k].name === parentName) {
            actualParent = k;
            break;
         }
  
   compiledSolarSystem.push(new CompiledSolarObject(solarSystem[i].name, solarSystem[i].diameter_km, solarSystem[i].rot_km_h, solarSystem[i].rev_km_s, solarSystem[i].color, solarSystem[i].aphelion_km, solarSystem[i].perihelion_km, solarSystem[i].eccentricity, actualParent, solarSystem[i].mean_anomaly_deg, solarSystem[i].longitude_of_ascending_node_deg, solarSystem[i].type));
}

//////////////////////////////
// CompiledSolarObjects End //
//////////////////////////////

/**
 * Makes the camera follow the stellar body closest to the mouse, if not following one already.
 * Makes the camera stop following a stellar body, if it is following one already.
 */
function followNearestBody() {
   if (camera.following == null) {
      let mousePosition = [mouse[0] - halfWidth, halfHeight - mouse[1]];
      
      mousePosition[0] = mousePosition[0] / camera.zoom + camera.x;
      mousePosition[1] = mousePosition[1] / camera.zoom + camera.y;
      
      let nearest = [Number.MAX_VALUE, Number.MAX_VALUE];
      let nearestParent = null;
      
      for (let i = 0; i < solarSystem.length; i++) 
           if (Math.sqrt(Math.pow(compiledSolarSystem[i].x - mousePosition[0], 2) + Math.pow(compiledSolarSystem[i].y - mousePosition[1], 2)) < Math.sqrt(Math.pow(nearest[0] - mousePosition[0], 2) + Math.pow(nearest[1] - mousePosition[1], 2))) {
              nearest[0] = compiledSolarSystem[i].x;
              nearest[1] = compiledSolarSystem[i].y;
              
              nearestParent = i;
           }
      
      camera.following = nearestParent;
      addNotification("Now following: " + solarSystem[nearestParent].name, 5);
   } else {
      addNotification("Stopped following: " + solarSystem[camera.following].name, 5);
      camera.following = null;
   }
}

////////////////////////
// Notification Start //
////////////////////////

let notificationQueue = [];

/**
 * Adds a notification to the queue.
 *
 * @param {string} message The message to be displayed.
 * @param {number} duration The length of the duration.
 */
function addNotification(message, duration) {
   notificationQueue.push({toast: message, time: duration});
}

/**
 * Refreshes the notifications, culling out ones past their prime.
 *
 * @param {number} deltaTime The amount of time that has passed since last program epoch.
 */
function refreshNotifications(deltaTime) {
   for (let i = 0; i < notificationQueue.length; i++) {
      let newDuration = notificationQueue[i].time - deltaTime;
      
      if (newDuration <= 0)
         notificationQueue.splice(i, 1);
      else 
         notificationQueue[i].time = newDuration;
   }
}

let currentPosition = 0;
/**
 * Renders the notifications to the screen
 */
function renderNotifications(deltaTime) {
   if (notificationQueue.length == 0)
      return;
   
   let notificationHeight = height / 25 + 20;
   let positionOffset;
   
   if (notificationQueue.length < maxDisplayedNotifications) {
      positionOffset = notificationHeight * (notificationQueue.length - 1);
   } else
      positionOffset = notificationHeight * (maxDisplayedNotifications - 1);
   
   let goalPosition = -notificationHeight * notificationQueue.length + positionOffset;
   
   if (currentPosition !== goalPosition) {
      currentPosition -= (currentPosition - goalPosition) * deltaTime * 2.5 + 0.02;
   }
   
   ctx.lineWidth = height / 166.7;
   
   for (let i = 0; i < notificationQueue.length; i++) {
      ctx.font = notificationHeight + "px Comic Sans MS";
      let textWidth = ctx.measureText(notificationQueue[i].toast).width;
      
      let yPosition = currentPosition + notificationHeight * (i + 1);
      let xPosition = width - textWidth;
      
      ctx.beginPath();
      ctx.fillStyle = notificationColor;
      ctx.fillRect(xPosition, yPosition, textWidth, notificationHeight);
      
      ctx.beginPath();
      ctx.strokeStyle = notificationBorderColor;
      ctx.rect(xPosition, yPosition, textWidth, notificationHeight);
      ctx.stroke();
      
      ctx.beginPath();
      ctx.fillStyle = notificationTextColor;
      ctx.fillText(notificationQueue[i].toast, xPosition, yPosition + notificationHeight - notificationHeight / 10);
   }
}

addNotification("Look in the CSS for controls", 10);

//////////////////////
// Notification End //
//////////////////////

const runProgram = setInterval(run, 1000 / 25); 
let lastTime1 = new Date();
/**
 * Runs the main calculations in the program.
 */
function run() {
   let currTime = new Date();
   let deltaTime = (currTime - lastTime1) / 1000;
   time += deltaTime / timeContractionFactor;
   lastTime1 = new Date();
   
   // Sped
   let speedFactor = 1
   if (speedUp && !speedDown)
      speedFactor = 10;
   else if (speedDown && !speedDown)
      speedFactor = 0.1
   
   if (camera.following != null) {
      camera.x = compiledSolarSystem[camera.following].x;
      camera.y = compiledSolarSystem[camera.following].y;
      
   } else {
      // Movement and zoom control
      if (moveUp && !moveDown)
         camera.y += camera.speed * speedFactor * deltaTime / camera.zoom;
      else if (moveDown && !moveUp)
         camera.y -= camera.speed * speedFactor * deltaTime / camera.zoom;
   
      if (moveLeft && !moveRight)
         camera.x -= camera.speed * speedFactor * deltaTime / camera.zoom;
      else if (moveRight && !moveLeft)
         camera.x += camera.speed * speedFactor * deltaTime / camera.zoom;
   }
   
   if (zoomIn && !zoomOut)
      camera.zoom += camera.zoomSpeed * camera.zoom * speedFactor * deltaTime;
   else if (zoomOut && !zoomIn)
      camera.zoom -= camera.zoomSpeed * camera.zoom * speedFactor * deltaTime;
   if (camera.zoom < 0.00000001)
      camera.zoom = 0.00000001;
   
   if (speedUpTime && !slowDownTime)
      timeContractionFactor -= Math.abs(timeContractionFactor) * speedFactor * deltaTime;
   else if (!speedUpTime && slowDownTime)
      timeContractionFactor += Math.abs(timeContractionFactor) * speedFactor * deltaTime;
   
   // Computes position in orbit
   for (let i = 1; i < compiledSolarSystem.length; i++) {
      let tempX = time;
      let tempY = time;
     
      if (compiledSolarSystem[i].rev_km_s != null) {
         tempX *= compiledSolarSystem[i].rev_km_s;
         tempY *= compiledSolarSystem[i].rev_km_s;
      }
         
      if (compiledSolarSystem[i].mean_anomaly_rad != null) {
         tempX += compiledSolarSystem[i].mean_anomaly_rad;
         tempY += compiledSolarSystem[i].mean_anomaly_rad;
      }
            
      if (compiledSolarSystem[i].longitude_of_ascending_node_rad != null) {
         tempX -= compiledSolarSystem[i].longitude_of_ascending_node_rad;
         tempY -= compiledSolarSystem[i].longitude_of_ascending_node_rad;
      }
      
      tempX = Math.cos(tempX);
      tempY = Math.sin(tempY);
      
      if (compiledSolarSystem[i].aphelion_km != null && compiledSolarSystem[i].perihelion_km != null) {
         tempX *= compiledSolarSystem[i].semiMajorAxis_km;
         tempY *= compiledSolarSystem[i].semiMinorAxis_km;
      
         tempX -= Math.abs(compiledSolarSystem[i].aphelion_km - compiledSolarSystem[i].perihelion_km);
      }
      
      let tempXX = tempX;
      let tempYY = tempY; 
      
      if (compiledSolarSystem[i].longitude_of_ascending_node_rad != null) {
         tempXX = tempX * Math.cos(compiledSolarSystem[i].longitude_of_ascending_node_rad) - tempY * Math.sin(compiledSolarSystem[i].longitude_of_ascending_node_rad);
         tempYY = tempX * Math.sin(compiledSolarSystem[i].longitude_of_ascending_node_rad) + tempY * Math.cos(compiledSolarSystem[i].longitude_of_ascending_node_rad);
      }
      
      if (compiledSolarSystem[i].parent != null) {
         tempXX += compiledSolarSystem[compiledSolarSystem[i].parent].x;
         tempYY += compiledSolarSystem[compiledSolarSystem[i].parent].y;
      }
      
      compiledSolarSystem[i].x = tempXX;
      compiledSolarSystem[i].y = tempYY;
   }

   refreshNotifications(deltaTime);
   
   applyOptions(optionsMenu);
}

let occlusionTypes = [];
const drawOutput = setInterval(draw, 1000 / 60); 
let lastTime2 = new Date();
/** 
 * Draws stuff to the screen.
 */
function draw() {
   let currTime = new Date();
   let deltaTime = (currTime - lastTime2) / 1000;
   
   canvas.width = window.innerWidth;
   canvas.height = window.innerHeight;
   width = canvas.width;
   height = canvas.height;
   halfWidth = width / 2;
   halfHeight = height / 2;
   
   // Resets screen.
   ctx.beginPath();
   ctx.fillStyle = backgroundColor;
   ctx.rect(0, 0, width, height);
   ctx.fill();
   
   // Orbit path renderer.
   for (let i = 1; i < compiledSolarSystem.length; i++) {
      if (!occlusionTypes[compiledSolarSystem[i].type + "_show"] || !occlusionTypes[compiledSolarSystem[i].type + "_showOrbit"]) {
         continue;
      }
      
      if (compiledSolarSystem[i].parent != null && compiledSolarSystem[i].aphelion_km != null && compiledSolarSystem[i].perihelion_km != null) {
         let tempX = -Math.abs(compiledSolarSystem[i].aphelion_km - compiledSolarSystem[i].perihelion_km);
         let tempY = 0;
         
         let tempXX = tempX;
         let tempYY = tempY;
      
         if (compiledSolarSystem[i].longitude_of_ascending_node_rad != null) {
            tempXX = tempX * Math.cos(compiledSolarSystem[i].longitude_of_ascending_node_rad) - tempY * Math.sin(compiledSolarSystem[i].longitude_of_ascending_node_rad);
            tempYY = tempX * Math.sin(compiledSolarSystem[i].longitude_of_ascending_node_rad) + tempY * Math.cos(compiledSolarSystem[i].longitude_of_ascending_node_rad);
         }
         
         tempXX += compiledSolarSystem[compiledSolarSystem[i].parent].x;
         tempYY += compiledSolarSystem[compiledSolarSystem[i].parent].y;
      
         tempXX = (tempXX - camera.x) * camera.zoom;
         tempYY = (tempYY - camera.y) * camera.zoom;
      
         // Checks if the orbit path is in view.
         if (Math.abs(tempXX) - halfWidth <= (compiledSolarSystem[i].semiMajorAxis_km + halfWidth) * Math.abs(camera.zoom) || Math.abs(tempYY) - halfHeight <= (compiledSolarSystem[i].semiMajorAxis_km + halfHeight) * Math.abs(camera.zoom)) {
            let majorAxis = compiledSolarSystem[i].semiMajorAxis_km * camera.zoom;
            let minorAxis = compiledSolarSystem[i].semiMinorAxis_km * camera.zoom;
            let ellipseWidth = camera.zoom / 3;
      
            ctx.beginPath();
            if (ellipseWidth > 2) 
               ctx.lineWidth = 2;
            else if (ellipseWidth < 1)
               ctx.lineWidth = 1;
            else
               ctx.lineWidth = ellipseWidth;
            ctx.strokeStyle = "lightgrey";
      
            if (solarSystem[i].longitude_of_ascending_node_deg != null) {
               ctx.ellipse(tempXX + halfWidth, halfHeight - tempYY, majorAxis, minorAxis, -compiledSolarSystem[i].longitude_of_ascending_node_rad, 0, 2 * Math.PI); 
            } else {
               ctx.ellipse(tempXX + halfWidth, halfHeight - tempYY, majorAxis, minorAxis, 0, 0, 2 * Math.PI); 
            }
      
            ctx.stroke();
         }
      }
   }
   
   // Stellar body renderer
   for (let i = 0; i < solarSystem.length; i++) {
      if (!occlusionTypes[compiledSolarSystem[i].type + "_show"])
         continue;
      
      let scaledTranslatedX = (compiledSolarSystem[i].x - camera.x) * camera.zoom;
      let scaledTranslatedY = (compiledSolarSystem[i].y - camera.y) * camera.zoom;
         
      // Chekcs if the stellar body is in view.
      if (Math.abs(scaledTranslatedX) - halfWidth <= (compiledSolarSystem[i].relativeSize + halfWidth) * Math.abs(camera.zoom) || Math.abs(scaledTranslatedY) - halfHeight <= (compiledSolarSystem[i].relativeSize + halfHeight) * Math.abs(camera.zoom)) {
         // The body
         ctx.beginPath();
         ctx.fillStyle = compiledSolarSystem[i].color;
         ctx.arc(scaledTranslatedX + halfWidth, halfHeight - scaledTranslatedY, compiledSolarSystem[i].relativeSize * Math.abs(camera.zoom), 0, 2 * Math.PI);
         ctx.fill();
         
         // and its name.
         if (compiledSolarSystem[i].name != null && occlusionTypes[compiledSolarSystem[i].type + "_showName"]) {
            let textOffsetY = Math.abs(compiledSolarSystem[i].relativeSize * camera.zoom) + height / 30; 
                
            ctx.beginPath();
            ctx.strokeStyle = compiledSolarSystem[i].color;
            ctx.font = fontSize + "px Comic Sans MS"
            ctx.strokeText(compiledSolarSystem[i].name, scaledTranslatedX + halfWidth, halfHeight - scaledTranslatedY + textOffsetY);
         }
      }
   }
   
   renderNotifications(deltaTime);
   
   ctx.beginPath();
   ctx.font = fontSize + "px Comic Sans MS";
   ctx.fillStyle = "#ffffff";
   ctx.fillText("x: " + camera.x + ", y: " + camera.y, 5, 25);
   
   optionsMenu.style.height = height + "px";
   optionsMenu.style["margin-top"] = "-" + (height + 36) + "px";
   
   lastTime2 = new Date();
}

////////////////////////
// Options Menu Begin //
////////////////////////

/**
 * Opens the options menu.
 */
function showOptions() {
   optionButtons[0].style.display = "none";
   optionButtons[1].style.display = "initial";
   
   canvas.style["margin-left"] = "20vw";
   optionsMenu.style["margin-left"] = "0";
}

/**
 * Closes the options menu.
 */
function hideOptions() {
   optionButtons[0].style.display = "initial";
   optionButtons[1].style.display = "none";
   
   canvas.style["margin-left"] = "0";
   optionsMenu.style["margin-left"] = "-20vw";
}

/**
 * Iterates throught an element tree to find options to apply.
 *
 * @param {object} optionElement The object to scan for options in.
 */
function applyOptions(optionElement) {
   let elementType = optionElement.nodeName;
   
   if (elementType === "INPUT")
      if (optionElement.type === "checkbox")
         applyCheckboxData(optionElement);
   
   let subOptions = optionElement.children;
   
   for (let i = 0; i < subOptions.length; i++) {
      applyOptions(subOptions[i]);
   }
}

/**
 * Applies certain changes according to the data of checkboxes.
 *
 * @param {object} checkbox The checkbox to get information from.
 */
function applyCheckboxData(checkbox) {
   let checkboxName = checkbox.name;
   
   console.log([checkboxName, checkbox.checked]);
   
   if (checkboxName === "showStars") {
      occlusionTypes["star_show"] = checkbox.checked;
      
   } else if (checkboxName === "showStarNames") {
      occlusionTypes["star_showName"] = checkbox.checked;
       
   } else if (checkboxName === "showPlanets") {
      occlusionTypes["planet_show"] = checkbox.checked;
      
   } else if (checkboxName === "showPlanetNames") {
      occlusionTypes["planet_showName"] = checkbox.checked;
      
   } else if (checkboxName === "showPlanetOrbits") {
      occlusionTypes["planet_showOrbit"] = checkbox.checked;
      
   } else if (checkboxName === "showMoons") {
      occlusionTypes["moon_show"] = checkbox.checked;
     
   } else if (checkboxName === "showMoonNames") {
      occlusionTypes["moon_showName"] = checkbox.checked;
      
   } else if (checkboxName === "showMoonOrbits")
      occlusionTypes["moon_showOrbit"] = checkbox.checked;
}

//////////////////////
// Options Menu End //
//////////////////////

///////////////////////////
// Event Listeners Begin //
///////////////////////////

window.addEventListener("keydown", function(e) {
   let key = e.keyCode;
   
   if (key == 65) // a
      moveLeft = true;
   if (key == 68) // d 
      moveRight = true;
   
   if (key == 87)
      moveUp = true; // w
   if (key == 83)
      moveDown = true; // s
   
   if (key == 49)
      zoomIn = true; // 1
   if (key == 50)
      zoomOut = true; // 2
   
   if (key == 16)
      speedUp = true; // shift
   if (key == 17)
      speedDown = true; // ctrl TODO REDO make diffrent key
   
   if (key == 70)
      followNearestBody(); // f
   
   if (key == 37) // <-
      slowDownTime = true;
   if (key == 39) // ->
      speedUpTime = true;
});

window.addEventListener("keyup", function(e) {
   let key = e.keyCode;
   
   if (key == 65) // a
      moveLeft = false;
   if (key == 68) // d
      moveRight = false;
   
   if (key == 87)
      moveUp = false; // w
   if (key == 83)
      moveDown = false; // s
   
   if (key == 49)
      zoomIn = false; // 1
   if (key == 50)
      zoomOut = false; // 2
   
   if (key == 16)
      speedUp = false; // shift
   if (key == 17)
      speedDown = false; // ctrl TODO REDO make diffrent key
   
   if (key == 37) // <-
      slowDownTime = false;
   if (key == 39) // ->
      speedUpTime = false;
});

canvas.addEventListener('mousemove', function(e) {
  let canvasPosition = canvas.getBoundingClientRect();
   
  mouse[0] = e.clientX - canvasPosition.x;
  mouse[1] = e.clientY - canvasPosition.y; 
});
