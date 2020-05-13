package papermache.weebd;

import org.bukkit.*;
import org.bukkit.entity.*;
import org.bukkit.event.EventHandler;
import org.bukkit.event.Listener;
import org.bukkit.event.entity.EntityCombustEvent;
import org.bukkit.event.player.AsyncPlayerChatEvent;
import org.bukkit.inventory.ItemStack;
import org.bukkit.scheduler.BukkitRunnable;
import papermache.weebd.misc.CustomMaterial;
import papermache.weebd.misc.MiscConstants;
import papermache.weebd.misc.MiscHelperFunctions;
import papermache.weebd.misc.CustomItems;

import java.util.Objects;

/**
 *  A collection of somewhat shocking events, mostly for gags and giggles.
 */
public final class REDACTED implements Listener {
    private static final long TOTEM_CONVERSION_TIME = 100; // The time, in ticks, for the totem conversion to complete.
    private static final long TOTEM_CONVERSION_DELAY = 30; // The time, in ticks, for the totem conversion to start, meant to scare people

    // Wouldn't wanna burn any bridges, now would we?? ;)
    @EventHandler
    public void chatCheck(AsyncPlayerChatEvent e) {
        String message = e.getMessage();
        Player p = e.getPlayer();
        World bigW = p.getWorld();

        if (message.toLowerCase().contains("nigger") || message.toLowerCase().contains("negro") || message.toLowerCase().contains("nigga")) {
            boolean heGood = false;

            // Tests for n-word passes
            for (int x = 0; x < p.getInventory().getContents().length; x++) {
                ItemStack testorino = p.getInventory().getItem(x);

                if (testorino != null && testorino.getType() == Material.PAPER && testorino.hasItemMeta() && testorino.getItemMeta().hasDisplayName()
                        && testorino.getItemMeta().getDisplayName().toLowerCase().contains("n-word pass")) {
                    heGood = true;
                    break;
                }
            }

            if (!heGood) {
                e.setCancelled(true);

                // Show em' Skipper
                MiscHelperFunctions.announceMessage("<Skipper> MRS. OBAMA GET DOWN!, " + ChatColor.DARK_GREEN + p.getDisplayName().toUpperCase()
                        + ChatColor.WHITE + " USED THE " + ChatColor.RED + "N-WORD!!!11!", false);

                bigW.setGameRule(GameRule.SHOW_DEATH_MESSAGES, false);

                new BukkitRunnable() { @Override public void run() {
                    MiscHelperFunctions.killLivingEntity(p);

                    // Haha trolled epic style with a custom death message
                    MiscHelperFunctions.announceMessage(p.getDisplayName() + MiscConstants.ebicDeathMessage[MiscHelperFunctions.randomIndex(MiscConstants.ebicDeathMessage.length)],
                            false);

                    bigW.setGameRule(GameRule.SHOW_DEATH_MESSAGES, true);

                    new BukkitRunnable() { @Override public void run() {
                        // Thank you Skipper, here is a n-word pass for your hard work.
                        MiscHelperFunctions.announceMessage("<Skipper> Well boys, we did it. Racism is no more.", false);
                    }}.runTaskLater(Weebd.currInstance, 40);
                }}.runTaskLater(Weebd.currInstance, 50);
            }
        }
    }

    // Constitutes the creation of a Totem Of Dying via trial by fire
    @EventHandler
    public void onItemBurn(EntityCombustEvent e) {
        Entity ent = e.getEntity();
        Location loc = ent.getLocation();

        if (loc.getWorld().hasStorm() || loc.getWorld().isThundering())
            return;

        if (ent.getType() == EntityType.DROPPED_ITEM) {
            ItemStack item = ((Item) ent).getItemStack();

            // TODO use hidden nbt tags, custom or not
            if (item.getType() == Material.TOTEM_OF_UNDYING && !item.getItemMeta().getDisplayName().equals("Totem of Dying")) {
                new BukkitRunnable() { @Override public void run() {
                    new BukkitRunnable() {
                        int tickCounter = 0;

                        @Override
                        public void run() {
                            if (tickCounter > TOTEM_CONVERSION_TIME * .8)
                                cancel();

                            loc.getWorld().spawnParticle(Particle.LAVA, loc, (int) Math.floor(Math.random() * 4));
                            loc.getWorld().playSound(loc, Sound.BLOCK_LAVA_POP, SoundCategory.HOSTILE, 1, 1);
                            tickCounter += 2;
                        }
                    }.runTaskTimer(Weebd.currInstance, 0, 2);

                    new BukkitRunnable() {
                        @Override
                        public void run() {
                            if (loc.getBlock().getType() != Material.FIRE) {
                                loc.getWorld().dropItemNaturally(loc, item);
                                loc.getWorld().spawnParticle(Particle.SMOKE_LARGE, loc, 25, 0.25, 0, 0.25, 0.1);
                                loc.getWorld().playSound(loc, Sound.BLOCK_FIRE_EXTINGUISH, SoundCategory.HOSTILE, 1, 1);
                            } else {
                                loc.getBlock().setType(Material.AIR);
                                loc.getWorld().dropItemNaturally(loc, Objects.requireNonNull(CustomItems.createCustomItem(CustomMaterial.TOTEM_OF_DYING, 1)));
                                loc.getWorld().spawnParticle(Particle.LAVA, loc, 50, 0.25, 0, 0.25);
                                loc.getWorld().spawnParticle(Particle.SMOKE_LARGE, loc, 25, 0.25, 0, 0.25, 0.1);
                                loc.getWorld().spawnParticle(Particle.TOTEM, loc, 100, 0.25, 0, 0.25);
                                loc.getWorld().playSound(loc, Sound.ENTITY_BLAZE_SHOOT, SoundCategory.HOSTILE, 1.5f, 0.5f);

                                ent.remove();
                            }
                        }
                    }.runTaskLater(Weebd.currInstance, TOTEM_CONVERSION_TIME);
                }}.runTaskLater(Weebd.currInstance, TOTEM_CONVERSION_DELAY);
            }
        }
    }

    // Kills entities holding a Totem of Dying, and plays cool effects
    static void livingEntityPeriodic(LivingEntity ent) {
        if (ent.getEquipment() == null)
            return;

        ItemStack totemOfDying = CustomItems.createCustomItem(CustomMaterial.TOTEM_OF_DYING, 1);
        ItemStack mainHeld = ent.getEquipment().getItemInMainHand(), offHeld = ent.getEquipment().getItemInOffHand();
        boolean inMain = false, inOff = false;

        if (mainHeld.getType() == Material.TOTEM_OF_UNDYING && mainHeld.hasItemMeta() &&
                mainHeld.getItemMeta().hasLore() && mainHeld.getLore().equals(totemOfDying.getItemMeta().getLore()))
            inMain = true;
        if (offHeld.getType() == Material.TOTEM_OF_UNDYING && offHeld.hasItemMeta() &&
                offHeld.getItemMeta().hasLore() && offHeld.getLore().equals(totemOfDying.getItemMeta().getLore()))
            inOff = true;

        if (inMain || inOff) {
            if (ent instanceof Player) {
                ent.getWorld().setGameRule(GameRule.SHOW_DEATH_MESSAGES, false);

                if (inMain)
                    ((Player) ent).getInventory().clear(((Player) ent).getInventory().getHeldItemSlot());
                if (inOff)
                    ((Player) ent).getInventory().clear(40);
            } else {
                if (inMain)
                    ent.getEquipment().setItemInMainHand(null);
                if (inOff)
                    ent.getEquipment().setItemInOffHand(null);
            }

            new BukkitRunnable() {
                @Override
                public void run() {
                    MiscHelperFunctions.killLivingEntity(ent);
                    ent.getWorld().playSound(ent.getLocation(), Sound.ITEM_TOTEM_USE, SoundCategory.PLAYERS, 2, 0.4f);


                    new BukkitRunnable() {
                        int ticksPassed = 0;

                        @Override
                        public void run() {
                            if (ticksPassed > 40)
                                cancel();
                            else {
                                ent.getWorld().spawnParticle(Particle.NAUTILUS, ent.getLocation().add(0, 2, 0), 50, 0.25, 0, 0.25, 1.5);
                                ticksPassed += 10;
                            }
                        }
                    }.runTaskTimer(Weebd.currInstance, 0, 10);

                    if (ent instanceof Player)
                        new BukkitRunnable() {
                            @Override
                            public void run() {
                                if (ent.isDead()) {
                                    MiscHelperFunctions.announceMessage(((Player) ent).getDisplayName() + MiscConstants.ebicDeathMessage[MiscHelperFunctions.randomIndex(MiscConstants.ebicDeathMessage.length)], false);
                                    ent.getWorld().setGameRule(GameRule.SHOW_DEATH_MESSAGES, true);
                                }
                            }
                        }.runTaskLater(Weebd.currInstance, 1);
                }
            }.runTaskLater(Weebd.currInstance, 1);
        }
    }
}
