import { PhysicalCollider } from "./physical-collider";
import { CurvedPhysicalCollider } from "./curved-physical-collider";
import { CustomCollider } from "@/types/new-gallery";

export function Collider(props: CustomCollider) {
  if (props.shape === 'box') {
    return <PhysicalCollider {...props} />;
  } else if (props.shape === 'curved') {
    return <CurvedPhysicalCollider {...props} />;
  }
  return null;
}