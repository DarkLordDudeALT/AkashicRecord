import sys

print()

pressure = 0

try:
    pressure = float(input("Enter the pressure that needs to be generated (in psi): "))

except Exception as exception:
    sys.exit("Error: " + str(exception))

if pressure <= 0:
    sys.exit("Pressure must be greater than 0!")

# Converts psi to atm
pressure *= 0.06804596379
volume = 0

try:
    volume = float(input("Enter the volume of the container (in L): "))

except Exception as exception:
    sys.exit("Error: " + str(exception))

if volume <= 0:
    sys.exit("Volume must be greater than 0!")

# Finds the mass of the air in the container, assuming temperature is 21*C and the starting pressure is 1 atm. 
mol_air = volume / 0.082057366080960 / 294.15
# Finds the mass of CO2 needed to generate the extra pressure, assuming the starting pressure is 1 atm. 
mol_CO2 = mol_air * pressure

print()
print(str(mol_CO2 * 84) + "g of NaHCO3 (baking soda) is needed")
g_CH3COOH = mol_CO2 * 60
print(str(g_CH3COOH) + "g of CH3COOH (acetic acid) is needed")
print()

CH3COOH_concentration = 0

try:
    CH3COOH_concentration = float(input("Enter the vinegar's concentration of CH3COOH (acetic acid): "))

except Exception as exception:
    sys.exit("Error: " + str(exception))

if CH3COOH_concentration <= 0 or CH3COOH_concentration >= 100:
    sys.exit("The concentration must be between 0 and 100 (exclusive)!")

CH3COOH_concentration /= 100
L_CH3COOH = g_CH3COOH * 0.00104938

print()
print(str(L_CH3COOH / CH3COOH_concentration) + " L of vinegar is needed")
