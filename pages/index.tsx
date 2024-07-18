import { NextPage } from "next"
import { useEffect } from "react"
import * as THREE from "three"
import { Vector3 } from "three"
import * as dat from "lil-gui"

const Home : NextPage = () => {
  let canvas : HTMLElement

  useEffect(() => {
    if (canvas) return
    // eslint-disable-next-line react-hooks/exhaustive-deps
    canvas = document.getElementById("canvas")

    const gui = new dat.GUI({ width : 300 })
    gui.show(true)

    const scene = new THREE.Scene()
    const sizes = {
      width : innerWidth,
      height : innerHeight
    }
    const camera = new THREE.PerspectiveCamera(
      45,
      sizes.width / sizes.height,
      0.001,
      1000
    )
    camera.position.z = 400
    const renderer = new THREE.WebGLRenderer({
      canvas : canvas,
    })
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(window.devicePixelRatio)

    // ライト
    const light = new THREE.PointLight(0xebf2ff,500,100)
    scene.add(light)

    // パス
    const pointsArray = [
      [68.5, 185.5],
      [1, 262.5],
      [270.9, 281.9],
      [345.5, 212.8],
      [178, 155.7],
      [240.3, 72.3],
      [153.4, 0.6],
      [52.6, 53.3],
      [68.5, 185.5]
    ]

    let points : Vector3[] = []
    for (let i = 0; i < pointsArray.length; i++) {
      const x = pointsArray[i][0]
      const y = 0
      const z = pointsArray[i][1]
      points.push(new THREE.Vector3(x, y, z))
    }
    const path = new THREE.CatmullRomCurve3(points)

    // チューブ
    const geometry = new THREE.TubeGeometry(path, 300, 2, 5, true)
    const material = new THREE.MeshLambertMaterial({
      color : 0x99c5ff,
      side : THREE.BackSide,
      wireframe : true
    })
    const tube = new THREE.Mesh(geometry, material)
    scene.add(tube)
    gui.addColor(material, "color")

    //アニメーション
    let percentage = 0
    const render = () => {
      percentage += 0.0003
      let p1 = path.getPointAt(percentage % 1)
      let p2 = path.getPointAt((percentage + 0.01) % 1)
      camera.position.set(p1.x, p1.y, p1.z)
      camera.lookAt(p2)
      light.position.set(p2.x, p2.y, p2.z)

      renderer.render(scene, camera)
      window.requestAnimationFrame(render)
    }
    render()

    //ブラウザのリサイズ操作
    window.addEventListener("resize", () => {
      sizes.width = window.innerWidth
      sizes.height = window.innerHeight

      camera.aspect = sizes.width / sizes.height
      camera.updateProjectionMatrix()

      renderer.setSize(sizes.width, sizes.height)
      renderer.setPixelRatio(window.devicePixelRatio)
    })
  }, [])

  return (
    <>
      <canvas id="canvas"></canvas>
    </>
  )
}

export default Home
